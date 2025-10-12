'use server';

import { revalidatePath } from 'next/cache';
import { addDoc, collection } from 'firebase/firestore';
import { updateContactStatus as dbUpdateContactStatus } from '@/lib/data';
import type { ContactStatus } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

export async function updateContactStatus(id: string, status: ContactStatus) {
  const { db } = await initializeFirebase();
  try {
    await dbUpdateContactStatus(db, id, status);
    revalidatePath('/admin/contact-leads');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to update contact status.' };
  }
}

export async function createContactSubmission(data: any) {
    const { db } = await initializeFirebase();
    try {
      await addDoc(collection(db, 'contact_submissions'), {
        ...data,
        submission_date: new Date().toISOString(),
        status: 'New',
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'An unknown error occurred.' };
    }
  }