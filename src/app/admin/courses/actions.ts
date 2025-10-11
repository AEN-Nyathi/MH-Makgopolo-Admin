'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { saveCourse, deleteCourse as dbDeleteCourse } from '@/lib/data';
import { generateSlug } from '@/ai/flows/automatic-slug-generation';
import { initializeFirebase } from '@/firebase';

const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  slug: z.string().optional(),
  short_description: z.string().min(10, 'Short description is too short.'),
  full_description: z.string().min(20, 'Full description is too short.'),
  grade_level: z.string().min(1, 'Grade level is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  is_active: z.boolean(),
});

export async function createOrUpdateCourse(formData: FormData) {
  const { db } = await initializeFirebase();
  const data = Object.fromEntries(formData.entries());
  
  const parsed = courseSchema.safeParse({
    ...data,
    price: parseFloat(data.price as string),
    is_active: data.is_active === 'true',
  });

  if (!parsed.success) {
    console.error("Validation failed:", parsed.error.flatten().fieldErrors);
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  let slug = parsed.data.slug;
  if (!slug && parsed.data.title) {
    try {
      const result = await generateSlug({ title: parsed.data.title });
      slug = result.slug;
    } catch (error) {
      console.error('AI Slug generation failed:', error);
      slug = parsed.data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
  }

  try {
    let courseData: any = { ...parsed.data, slug: slug! };
    if (!parsed.data.id) {
        courseData = {
            ...courseData,
            created_at: new Date().toISOString()
        }
    }
    console.log("Attempting to save course data:", courseData);
    await saveCourse(db, courseData);
    revalidatePath('/admin/courses');
    return { success: true };
  } catch (e) {
    console.error("Failed to save course:", e);
    return { success: false, errors: { _server: ['Failed to save course.'] } };
  }
}

export async function deleteCourse(id: string) {
  const { db } = await initializeFirebase();
  try {
    await dbDeleteCourse(db, id);
    revalidatePath('/admin/courses');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to delete course.' };
  }
}
