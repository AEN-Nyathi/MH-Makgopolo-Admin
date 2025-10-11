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

    cookies().set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    // It's better to return a generic error message on the server
    // to avoid leaking implementation details.
    return { success: false, error: 'Invalid email or password.' };
  }
}

export async function logout() {
  cookies().delete('session');
}
