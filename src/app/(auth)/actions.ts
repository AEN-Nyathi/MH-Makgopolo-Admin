'use server';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth/web-extension';
import { initializeFirebase } from '@/firebase';
import { cookies } from 'next/headers';

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
    return { success: false, error: error.message };
  }
}

export async function logout() {
  cookies().delete('session');
}
