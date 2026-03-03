"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaArrowLeft, FaCommentAlt, FaShare, FaHeart, FaReply } from "react-icons/fa";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
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
    const { addToast } = useToast();

    // Helper: Generate a consistent anonymous name for the current user in this thread.
    // In a real app we'd use a session ID or Firebase Auth UID. For demo, we'll store a pseudo-ID in localStorage.
    const getAnonymousName = () => {
        const localIdKey = `ungloss_anon_id_${id}`;
        let myAnonId = localStorage.getItem(localIdKey);
        
        if (!myAnonId) {
            // Count unique authors currently in the thread to generate the next number
            const uniqueAuthors = new Set(comments.map(c => c.authorName));
            const nextNumber = uniqueAuthors.size + 1;
            
            // Pool of corporate-themed funny names
            const prefixes = ["Synergistic", "Pivot", "Bandwidth", "Agile", "Holistic", "Circling", "Frictionless"];
            const nouns = ["Zombie", "Ninja", "Guru", "Rockstar", "Unicorn", "Synergy", "Paradigm"];
            
            // We use simple math to deterministically pick a name combo if we want, or random.
            // Random is fine since we save it to localStorage for this specific thread.
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            
            myAnonId = `${prefix} ${noun} ${nextNumber}`;
            localStorage.setItem(localIdKey, myAnonId);
        }
        return myAnonId;
    };

    // Helper function to build a tree from the flat array of comments
    const buildCommentTree = (flatComments: any[]) => {
        const commentMap: any = {};
        const roots: any[] = [];

        flatComments.forEach(c => {
            commentMap[c.id] = { ...c, children: [] };
        });

        flatComments.forEach(c => {
            // Firestore might return undefined instead of null if we don't save the field.
            // Or it might be an empty string. We treat all falsy values as root.
            if (c.parentId) {
                if (commentMap[c.parentId]) {
                    commentMap[c.parentId].children.push(commentMap[c.id]);
                } else {
                    roots.push(commentMap[c.id]); // Parent was deleted or is missing, treat as root
                }
            } else {
                roots.push(commentMap[c.id]);
            }
        });
        return roots;
    };

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

    const handleAddComment = async (e: React.FormEvent, parentId: string | null = null, textOverride: string | null = null) => {
        if (e) e.preventDefault();
        const textToSubmit = textOverride !== null ? textOverride : newComment;
        if (!textToSubmit.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                translationId: id,
                parentId: parentId || "", // Use empty string instead of null for easier Firestore querying/indexing later
                authorName: getAnonymousName(),
                text: textToSubmit.trim(),
                timestamp: serverTimestamp()
            });
            if (!parentId) setNewComment(""); // Clear input on success
        } catch (error) {
            console.error("Error adding comment:", error);
            addToast("Failed to post comment. Ensure systems are online.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async () => {
        if (!translation) return;
        try {
            const docRef = doc(db, "translations", translation.id);
            await updateDoc(docRef, {
                likes: increment(1)
            });
            // Update local state for immediate feedback
            setTranslation((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
        } catch (error) {
            console.error("Error liking post:", error);
            addToast("Failed to like post.", "error");
        }
    };

    if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "100px", color: "var(--signal-white)" }}>Loading sequence...</div>;
    if (!translation) return <div style={{ display: "flex", justifyContent: "center", padding: "100px", color: "var(--signal-white)" }}>Data not found.</div>;

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "40px 24px" }}>
            <main style={{ maxWidth: "800px", margin: "0 auto", width: "100%", flex: 1 }}>
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
                        <div style={{ display: "flex", gap: "16px", borderTop: "1px solid var(--glass-border)", paddingTop: "16px", marginTop: "8px" }}>
                            
                            <button
                                onClick={handleLike}
                                style={{
                                    background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "bold",
                                    display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: "0", transition: "color 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = "var(--signal-white)"}
                                onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                                <FaHeart color={(translation.likes || 0) > 0 ? "var(--warning-orange)" : "currentColor"} /> 
                                {translation.likes || 0} Likes
                            </button>

                            <div style={{
                                display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "bold"
                            }}>
                                <FaCommentAlt /> {comments.length} Comments
                            </div>

                            <button
                                onClick={handleCopyShareUrl}
                                style={{
                                    background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "bold",
                                    display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: "0", transition: "color 0.2s"
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
                                    Commenting anonymously
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
                                buildCommentTree(comments).map(comment => (
                                    <CommentNode 
                                        key={comment.id} 
                                        comment={comment} 
                                        onReply={(text, parentId) => handleAddComment(null as any, parentId, text)} 
                                        submitting={submitting}
                                    />
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

// Recursive Comment Component to handle Reddit-style threading
function CommentNode({ comment, onReply, submitting }: { comment: any, onReply: (text: string, parentId: string) => void, submitting: boolean }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
        onReply(replyText, comment.id);
        setReplyText("");
        setIsReplying(false);
    };

    return (
        <div style={{ 
            marginTop: comment.parentId ? "12px" : "0", 
            paddingLeft: comment.parentId ? "16px" : "0", 
            borderLeft: comment.parentId ? "2px solid rgba(255,255,255,0.05)" : "none",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
        }}>
            <div className="glass-panel" style={{ padding: "16px", border: "none", background: comment.parentId ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--electric-blue)", fontWeight: "bold" }}>
                        {comment.authorName}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }} suppressHydrationWarning>
                        {comment.timestamp?.seconds ? new Date(comment.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                    </span>
                </div>
                <p style={{ color: "var(--signal-white)", fontSize: "0.95rem", whiteSpace: "pre-wrap", margin: 0, marginBottom: "12px" }}>
                    {comment.text}
                </p>

                {/* Reply Button */}
                <button
                    onClick={() => setIsReplying(!isReplying)}
                    style={{
                        background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "bold",
                        display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: "0", transition: "color 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = "var(--warning-orange)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                    <FaReply /> {isReplying ? "Cancel" : "Reply"}
                </button>

                {/* Inline Reply Form */}
                {isReplying && (
                    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <textarea
                            className="glass-input"
                            rows={2}
                            placeholder={`Replying to ${comment.authorName}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            style={{ fontSize: "0.85rem", padding: "12px" }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                                onClick={handleReplySubmit}
                                className="action-button btn-ungloss"
                                disabled={!replyText.trim() || submitting}
                                style={{ padding: "6px 16px", fontSize: "0.75rem" }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Recursively Render Children */}
            {comment.children && comment.children.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {comment.children.map((child: any) => (
                        <CommentNode 
                            key={child.id} 
                            comment={child} 
                            onReply={onReply} 
                            submitting={submitting} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
