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
    // Ensure all fields from the form are included
    await addDoc(collection(db, 'registrations'), {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      idNumber: data.idNumber,
      course: data.course,
      submission_date: new Date().toISOString(),
      status: 'New', // Explicitly set default status
      // address and emergency contacts are not in the new form
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
