'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateTestimonialApproval as dbUpdateTestimonialApproval, saveTestimonial } from '@/lib/data';
import { initializeFirebase } from '@/firebase';
import { revalidateClientPath } from '@/lib/revalidate';

const testimonialSchema = z.object({
  id: z.string().optional(),
  student_name: z.string().min(2, 'Client name is too short'),
  current_position: z.string().min(2, 'Client role is too short'),
  testimonial_text: z.string().min(10, 'Testimonial text is too short'),
  is_approved: z.boolean(),
  is_featured: z.boolean(),
  rating: z.coerce.number().min(1).max(5).optional(),
});

export async function createOrUpdateTestimonial(formData: FormData) {
  const { db } = await initializeFirebase();
  const data = Object.fromEntries(formData.entries());
  
  const parsed = testimonialSchema.safeParse({
    ...data,
    is_approved: data.is_approved === 'true',
    is_featured: data.is_featured === 'true',
    rating: data.rating ? parseInt(data.rating as string, 10) : undefined,
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await saveTestimonial(db, parsed.data);
    revalidatePath('/admin/testimonials');
    await revalidateClientPath('/testimonials');
    await revalidateClientPath('/');
    return { success: true };
  } catch (e: any) {
    return { success: false, errors: { _server: [e.message || 'Failed to save testimonial.'] } };
  }
}


export async function toggleTestimonialApproval(id: string, currentStatus: boolean) {
  const { db } = await initializeFirebase();
  try {
    await dbUpdateTestimonialApproval(db, id, !currentStatus);
    revalidatePath('/admin/testimonials');
    await revalidateClientPath('/testimonials');
    await revalidateClientPath('/');
    return { success: true, newStatus: !currentStatus };
  } catch (e) {
    return { success: false, message: 'Failed to update testimonial status.' };
  }
}
