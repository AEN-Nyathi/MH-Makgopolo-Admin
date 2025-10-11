'use server';

import { revalidatePath } from 'next/cache';
import { updateTestimonialApproval as dbUpdateTestimonialApproval } from '@/lib/data';
import { initializeFirebase } from '@/firebase';

export async function toggleTestimonialApproval(id: string, currentStatus: boolean) {
  const { db } = await initializeFirebase();
  try {
    await dbUpdateTestimonialApproval(db, id, !currentStatus);
    revalidatePath('/admin/testimonials');
    return { success: true, newStatus: !currentStatus };
  } catch (e) {
    return { success: false, message: 'Failed to update testimonial status.' };
  }
}
