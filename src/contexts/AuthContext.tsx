import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GithubAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Ensure user document exists
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
              role: 'user'
            });
          }
        } catch (error: any) {
          console.error("Error creating user profile:", error);
          const errInfo = {
            error: error instanceof Error ? error.message : String(error),
            operationType: 'create',
            path: `users/${currentUser.uid}`,
            authInfo: {
              userId: currentUser.uid,
              email: currentUser.email,
              emailVerified: currentUser.emailVerified,
              isAnonymous: currentUser.isAnonymous,
            }
          };
          console.error('Firestore Error: ', JSON.stringify(errInfo));
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      // Update local state to reflect the new display name immediately
      setUser({ ...userCredential.user, displayName: name } as User);
      
      // Also update the Firestore document if it was already created by onAuthStateChanged
      const userRef = doc(db, 'users', userCredential.user.uid);
      try {
        await setDoc(userRef, { displayName: name }, { merge: true });
      } catch (e) {
        console.error("Error updating displayName in Firestore:", e);
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGithub, signUpWithEmail, signInWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
