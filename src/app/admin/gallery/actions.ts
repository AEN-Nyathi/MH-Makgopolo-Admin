'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { saveGalleryImage, deleteGalleryImage as dbDeleteGalleryImage } from '@/lib/data';

const galleryImageSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  image_url: z.string().url('Must be a valid URL'),
  category: z.enum(['training', 'graduates', 'facilities', 'events']),
  is_active: z.boolean(),
});

export async function createOrUpdateGalleryImage(formData: FormData) {
  const { db } = await initializeFirebase();
  const data = Object.fromEntries(formData.entries());
  
  const parsed = galleryImageSchema.safeParse({
    ...data,
    is_active: data.is_active === 'true',
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await saveGalleryImage(db, parsed.data);
    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (e) {
    return { success: false, errors: { _server: ['Failed to save gallery image.'] } };
  }
}

export async function deleteGalleryImage(id: string) {
    const { db } = await initializeFirebase();
  try {
    await dbDeleteGalleryImage(db, id);
    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to delete gallery image.' };
  }
}
