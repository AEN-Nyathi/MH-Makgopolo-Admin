'use server';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { cookies } from 'next/headers';
import { AuthError } from 'firebase/auth';

export async function login(data: any) {
  try {
    const { auth } = await initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const idToken = await userCredential.user.getIdToken();

    (await cookies()).set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    // Return the specific Firebase error message
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}

export async function logout() {
  (await cookies()).delete('session');
}
