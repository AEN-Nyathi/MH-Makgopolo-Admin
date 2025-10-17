'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { saveBlogPost, deleteBlogPost as dbDeleteBlogPost, getBlogPostById } from '@/lib/data';
import { revalidateClientPath } from '@/lib/revalidate';

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
  const { db } = await initializeFirebase();
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
    slug = parsed.data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }

  try {
    const postData = { ...parsed.data, slug: slug!, image_url: parsed.data.image_url || 'https://picsum.photos/seed/placeholder/800/600' };
    await saveBlogPost(db, postData);
    revalidatePath('/admin/blog');
    if (slug) {
        revalidatePath(`/blog/${slug}`);
        await revalidateClientPath(`/blog/${slug}`);
    }
    await revalidateClientPath('/blog');
    return { success: true };
  } catch (e) {
    return { success: false, errors: { _server: ['Failed to save blog post.'] } };
  }
}

export async function deleteBlogPost(id: string) {
    const { db } = await initializeFirebase();
  try {
    const post = await getBlogPostById(db, id);
    await dbDeleteBlogPost(db, id);
    revalidatePath('/admin/blog');
    await revalidateClientPath('/blog');
    if (post && post.slug) {
      await revalidateClientPath(`/blog/${post.slug}`);
    }
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to delete blog post.' };
  }
}

export async function toggleBlogPostStatus(id: string, currentStatus: boolean) {
    const { db } = await initializeFirebase();
    try {
        const post = await getBlogPostById(db, id);
        if (!post) {
            return { success: false, message: 'Blog post not found.' };
        }
        await saveBlogPost(db, { id, is_published: !currentStatus });
        revalidatePath('/admin/blog');
        revalidatePath(`/admin/blog/${id}/edit`);
        if (post.slug) {
          revalidatePath(`/blog/${post.slug}`);
          await revalidateClientPath(`/blog/${post.slug}`);
        }
        await revalidateClientPath('/blog');
        return { success: true, newStatus: !currentStatus };
    } catch (e) {
        return { success: false, message: 'Failed to update blog post status.' };
    }
}
