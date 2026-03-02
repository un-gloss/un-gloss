"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (e: string, p: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // [MOCKED FOR UI DEV] Bypass Firebase entirely
        setUser({ 
            uid: "mock-uid-123", 
            displayName: "Demo User", 
            email: "demo@example.com", 
            photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=Jude" 
        } as any);
        setLoading(false);
    }, []);

    const signInWithGoogle = async () => {
        console.log("Google Sign-In is temporarily disabled.");
    };

    const signInWithEmail = async () => {
        console.log("Email Sign-In is temporarily disabled.");
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
