import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// The sender email must be verified on Resend (e.g., onboarding@resend.dev for testing, or a custom domain)
const FROM_EMAIL = 'onboarding@resend.dev';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        // 1. Check if email already exists in Firestore to prevent spam/duplicates
        const q = query(collection(db, 'newsletter_subs'), where('email', '==', email.toLowerCase().trim()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return NextResponse.json({ message: 'Email already subscribed', isDuplicate: true }, { status: 200 });
        }

        // 2. Save the new subscriber to Firestore
        await addDoc(collection(db, 'newsletter_subs'), {
            email: email.toLowerCase().trim(),
            timestamp: serverTimestamp(),
            source: 'API' // Tracking origin
        });

        // 3. Send the Welcome Email via Resend
        if (resend) {
            try {
                const data = await resend.emails.send({
                    from: `Un-gloss <${FROM_EMAIL}>`,
                    to: email, // If not on a paid plan, resend limits sends to the verified domain owner's email only
                    subject: 'Welcome to Un-gloss: No More Synergies',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d1117; color: #f0f6fc;">
                            <h1 style="color: #ff5722; text-transform: uppercase;">Welcome to Un-gloss</h1>
                            <p style="font-size: 16px; line-height: 1.5; color: #c9d1d9;">
                                We are absolutely thrilled to have you onboard this synergistic journey. 
                                <br/><br/>
                                Just kidding.
                            </p>
                            <p style="font-size: 16px; line-height: 1.5; color: #c9d1d9;">
                                Thanks for joining the resistance against corporate fog. We’ll send you the best (worst) corporate jargon breakdowns straight to your inbox.
                            </p>
                            <p style="font-size: 14px; margin-top: 40px; color: #8b949e;">
                                Stay un-glossed,<br/>
                                <strong>The Un-gloss Team</strong>
                            </p>
                        </div>
                    `
                });
                
                return NextResponse.json({ message: 'Subscription successful and email sent', data }, { status: 200 });
            } catch (emailError) {
                console.error('Error sending welcome email via Resend:', emailError);
                // We still return 200 because the subscription itself succeeded 
                return NextResponse.json({ message: 'Subscription successful, but email failed to send' }, { status: 200 });
            }
        } else {
            // Missing API Key fallback mode:
            console.warn('RESEND_API_KEY is not set. Subscription saved to Firestore, but email was skipped.');
            return NextResponse.json({ message: 'Subscription successful (Email skipped: Missing API Key)' }, { status: 200 });
        }

    } catch (error) {
        console.error('Subscription API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
