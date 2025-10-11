'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { saveBlogPost, deleteBlogPost as dbDeleteBlogPost } from '@/lib/data';
import { generateSlug } from '@/ai/flows/automatic-slug-generation';
import type { BlogPost } from '@/lib/types';

const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title is too short'),
  slug: z.string().optional(),
  author: z.string().min(2, 'Author name is required'),
  category: z.string().min(2, 'Category is required'),
  excerpt: z.string().min(10, 'Excerpt is too short'),
  content: z.string().min(20, 'Content is too short'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  published_at: z.string(),
  is_published: z.boolean(),
});

export async function createOrUpdateBlogPost(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const parsed = blogPostSchema.safeParse({
    ...data,
    is_published: data.is_published === 'true',
  });

  if (!parsed.success) {
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
    const postData: Omit<BlogPost, 'created_at'> = { ...parsed.data, slug: slug!, image_url: parsed.data.image_url || 'https://picsum.photos/seed/placeholder/800/600' };
    await saveBlogPost(postData);
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (e) {
    return { success: false, errors: { _server: ['Failed to save blog post.'] } };
  }
}

export async function toggleBlogPostStatus(id: string, currentStatus: boolean) {
  try {
    await saveBlogPost({ id, is_published: !currentStatus } as any);
    revalidatePath('/admin/blog');
    return { success: true, newStatus: !currentStatus };
  } catch (e) {
    return { success: false, message: 'Failed to update status.' };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await dbDeleteBlogPost(id);
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to delete blog post.' };
  }
}
