'use client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { ReactNode, createContext, useContext } from 'react';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
});

interface FirebaseProviderProps {
  children: ReactNode;
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

export function FirebaseProvider({
  children,
  app,
  auth,
  db,
}: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={{ app, auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext).app!;
export const useAuth = () => useContext(FirebaseContext).auth!;
export const useFirestore = () => useContext(FirebaseContext).db!;
