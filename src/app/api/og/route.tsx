import { ImageResponse } from 'next/og';
import { getTermBySlug } from '@/lib/dictionary';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const termSlug = searchParams.get('term');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.un-gloss.com';

        if (!termSlug) {
            return new ImageResponse(
                (
                    <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', color: 'white' }}>
                        Missing Term
                    </div>
                ),
                { width: 1200, height: 630 }
            );
        }

        const termData = getTermBySlug(termSlug);

        return new ImageResponse(
            (
                <div
                    style={{
                        background: '#0a0a0a',
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        padding: '40px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Brand Header */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
                        <div style={{ color: '#007BFF', fontSize: '32px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            UN-GLOSS
                        </div>
                    </div>

                    {/* Content Box */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '900px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '60px',
                        borderRadius: '24px',
                    }}>
                        <div style={{ fontSize: '24px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', display: 'flex' }}>
                            Corporate Translation
                        </div>
                        <div style={{ fontSize: '64px', fontWeight: 'bold', color: 'white', marginBottom: '40px', display: 'flex' }}>
                            {termData?.term || termSlug}
                        </div>
                        
                        <div style={{ fontSize: '20px', color: '#007BFF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex' }}>
                            What they actually mean:
                        </div>
                        <div style={{ fontSize: '36px', color: '#eee', lineHeight: '1.4', display: 'flex' }}>
                            "{termData?.theTruth || "Loading meaning..."}"
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.error(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
