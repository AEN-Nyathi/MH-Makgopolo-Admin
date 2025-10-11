'use server';

import { revalidatePath } from 'next/cache';
import { updateContactStatus as dbUpdateContactStatus } from '@/lib/data';
import type { ContactStatus } from '@/lib/types';

export async function updateContactStatus(id: string, status: ContactStatus) {
  try {
    await dbUpdateContactStatus(id, status);
    revalidatePath('/admin/contact-leads');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to update contact status.' };
  }
}
