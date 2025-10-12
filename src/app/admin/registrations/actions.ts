'use server';

import { revalidatePath } from 'next/cache';
import { addDoc, collection } from 'firebase/firestore';
import { updateRegistrationStatus as dbUpdateRegistrationStatus } from '@/lib/data';
import type { RegistrationStatus } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

export async function updateRegistrationStatus(id: string, status: RegistrationStatus) {
  const { db } = await initializeFirebase();
  try {
    await dbUpdateRegistrationStatus(db, id, status);
    revalidatePath('/admin/registrations');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to update registration status.' };
  }
}

export async function createCourseRegistration(data: any) {
  const { db } = await initializeFirebase();
  try {
    await addDoc(collection(db, 'course_registrations'), {
      ...data,
      submission_date: new Date().toISOString(),
      status: 'New',
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
