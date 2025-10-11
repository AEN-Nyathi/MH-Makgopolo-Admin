'use server';

import { revalidatePath } from 'next/cache';
import { updateTestimonialApproval as dbUpdateTestimonialApproval } from '@/lib/data';

export async function toggleTestimonialApproval(id: string, currentStatus: boolean) {
  try {
    await dbUpdateTestimonialApproval(id, !currentStatus);
    revalidatePath('/admin/testimonials');
    return { success: true, newStatus: !currentStatus };
  } catch (e) {
    return { success: false, message: 'Failed to update testimonial status.' };
  }
}
