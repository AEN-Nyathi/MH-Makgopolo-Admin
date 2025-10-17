'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { saveCourse, deleteCourse as dbDeleteCourse, getCourseById } from '@/lib/data';
import { initializeFirebase } from '@/firebase';
import { revalidateClientPath } from '@/lib/revalidate';

const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  slug: z.string().optional(),
  short_description: z.string().min(10, 'Short description is too short.'),
  description: z.string().min(20, 'Full description is too short.'),
  grade_level: z.string().min(1, 'Grade level is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  requirements: z.string().optional(),
  certification: z.string().optional(),
  job_prospects: z.string().optional(),
  order_index: z.coerce.number().optional(),
});

export async function createOrUpdateCourse(formData: FormData) {
  const { db } = await initializeFirebase();
  const data = Object.fromEntries(formData.entries());
  
  const parsed = courseSchema.safeParse({
    ...data,
    price: parseFloat(data.price as string),
    is_active: data.is_active === 'true',
    is_featured: data.is_featured === 'true',
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  let slug = parsed.data.slug;
  if (!slug && parsed.data.title) {
    slug = parsed.data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  try {
    let courseData: any = { ...parsed.data, slug: slug! };
    
    await saveCourse(db, courseData);
    revalidatePath('/admin/courses');
    await revalidateClientPath('/courses');
    if (slug) {
        await revalidateClientPath(`/courses/${slug}`);
    }
    await revalidateClientPath('/');
    return { success: true };
  } catch (e: any) {
    console.error('[Courses Action] Failed to save course:', e);
    return { success: false, errors: { _server: [e.message || 'Failed to save course.'] } };
  }
}

export async function deleteCourse(id: string) {
  const { db } = await initializeFirebase();
  try {
    const course = await getCourseById(db, id);
    await dbDeleteCourse(db, id);
    revalidatePath('/admin/courses');
    await revalidateClientPath('/courses');
    if (course && course.slug) {
        await revalidateClientPath(`/courses/${course.slug}`);
    }
    await revalidateClientPath('/');
    return { success: true };
  } catch (e:any) {
    return { success: false, message: e.message || 'Failed to delete course.' };
  }
}
