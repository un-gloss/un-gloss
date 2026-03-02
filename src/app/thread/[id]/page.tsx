"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaArrowLeft, FaCommentAlt, FaShare } from "react-icons/fa";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle"; // Reusing the toggle for consistency

export default function ThreadPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [translation, setTranslation] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Fetch the original translation post
    useEffect(() => {
        if (!id) return;

        const fetchTranslation = async () => {
            try {
                const docRef = doc(db, "translations", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTranslation({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such translation!");
                    setTranslation(null); // Or redirect to 404
                }
            } catch (error) {
                console.error("Error fetching translation:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTranslation();
    }, [id]);

    // Live-listen for comments on this thread
    useEffect(() => {
        if (!id) return;

        const q = query(
            collection(db, "comments"),
            where("translationId", "==", id),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedComments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(fetchedComments);
        });

        return () => unsubscribe();
    }, [id]);

    const handleCopyShareUrl = () => {
        const url = `${window.location.origin}/thread/${id}`;
        navigator.clipboard.writeText(url);
        alert("Thread link copied to clipboard!");
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                translationId: id,
                authorName: "Demo User", // Hardcoded per requirements for Phase 4
                text: newComment.trim(),
                timestamp: serverTimestamp()
            });
            setNewComment(""); // Clear input on success
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to post comment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "100px", color: "var(--signal-white)" }}>Loading sequence...</div>;
    if (!translation) return <div style={{ display: "flex", justifyContent: "center", padding: "100px", color: "var(--signal-white)" }}>Data not found.</div>;

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Thread Header */}
            <header className="glass-panel" style={{
                position: "sticky", top: 0, zIndex: 50, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: "transparent", border: "1px solid var(--glass-border)", borderRadius: "50%",
                            width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                            color: "var(--signal-white)", cursor: "pointer", transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                    >
                        <FaArrowLeft size={16} />
                    </button>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.05em", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                            <span style={{ color: "var(--electric-blue)", marginRight: "4px" }}>U/</span>
                            <span style={{ color: "var(--signal-white)" }}>Un</span>gloss
                        </div>
                    </Link>
                </div>
                <ThemeToggle />
            </header>

            <main style={{ flex: 1, padding: "24px", display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* The Original Translation Post */}
                    <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", border: `1px solid ${translation.mode === 'hallucinate' ? 'var(--warning-orange)' : 'var(--electric-blue)'}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    POSTED BY ANONYMOUS {translation.timestamp?.seconds ? `• ${new Date(translation.timestamp.seconds * 1000).toLocaleDateString()}` : ''}
                                </span>
                                <span style={{ fontSize: "0.85rem", color: "var(--warning-orange)", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.05em" }}>
                                    {translation.mode === 'hallucinate' ? 'HALLUCINATION' : 'UN-GLOSSED'} • B.S. Score: {translation.bsScore}%
                                </span>
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: "1rem", color: "var(--text-muted)", fontFamily: "'Roboto Mono', monospace", marginBottom: "12px", fontStyle: "italic", whiteSpace: "pre-wrap" }}>
                                "{translation.originalText}"
                            </p>
                            <p className={translation.mode === 'hallucinate' ? "corporate-text" : "human-text"} style={{ fontSize: "1.1rem", whiteSpace: "pre-wrap" }}>
                                {translation.translation}
                            </p>
                        </div>

                        {/* Thread Action Bar */}
                        <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--glass-border)", paddingTop: "16px", marginTop: "8px" }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "bold"
                            }}>
                                <FaCommentAlt /> {comments.length} Comments
                            </div>

                            <button
                                onClick={handleCopyShareUrl}
                                style={{
                                    background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "bold",
                                    display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: "0"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = "var(--signal-white)"}
                                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                                <FaShare /> Share
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        
                        {/* Add Comment Input */}
                        <div className="glass-panel" style={{ padding: "16px" }}>
                            <form onSubmit={handleAddComment} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ fontSize: "0.85rem", color: "var(--signal-white)" }}>
                                    Commenting as <span style={{ color: "var(--electric-blue)", fontWeight: "bold" }}>Demo User</span>
                                </div>
                                <textarea
                                    className="glass-input"
                                    rows={3}
                                    placeholder="Add to the discussion..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{ fontSize: "0.95rem" }}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button
                                        type="submit"
                                        className="action-button btn-ungloss"
                                        disabled={!newComment.trim() || submitting}
                                        style={{ padding: "8px 24px", fontSize: "0.85rem" }}
                                    >
                                        {submitting ? "POSTING..." : "POST COMMENT"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Comment List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {comments.length === 0 ? (
                                <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "24px", fontStyle: "italic", fontSize: "0.9rem" }}>
                                    No comments yet. Be the first to decipher this fog.
                                </div>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="glass-panel" style={{ padding: "16px", border: "none", background: "rgba(255,255,255,0.02)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "0.85rem", color: "var(--electric-blue)", fontWeight: "bold" }}>
                                                {comment.authorName}
                                            </span>
                                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }} suppressHydrationWarning>
                                                {comment.timestamp?.seconds ? new Date(comment.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                                            </span>
                                        </div>
                                        <p style={{ color: "var(--signal-white)", fontSize: "0.95rem", whiteSpace: "pre-wrap", margin: 0 }}>
                                            {comment.text}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
