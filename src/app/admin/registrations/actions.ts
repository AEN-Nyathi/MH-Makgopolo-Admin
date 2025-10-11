'use server';

import { revalidatePath } from 'next/cache';
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
