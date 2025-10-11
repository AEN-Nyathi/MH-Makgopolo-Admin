'use client';

import { useEffect, useState } from 'react';
import { getBlogPostById } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { BlogPostForm } from '../../components/blog-post-form';
import { useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const db = useFirestore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getBlogPostById(db, params.id).then((data) => {
        setPost(data);
        setLoading(false);
      });
    }
  }, [db, params.id]);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Edit Blog Post"
          description="Update the content and properties of this post."
        />
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </>
    );
  }

  if (!post) {
    return <div>Blog post not found.</div>;
  }

  return (
    <>
      <PageHeader
        title="Edit Blog Post"
        description="Update the content and properties of this post."
      />
      <BlogPostForm initialData={post} />
    </>
  );
}
