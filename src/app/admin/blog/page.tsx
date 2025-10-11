'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { BlogPostsTable } from './components/blog-posts-table';
import { useFirestore } from '@/firebase';
import { BlogPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPage() {
  const db = useFirestore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getBlogPosts(db).then(data => {
        setPosts(data);
        setLoading(false);
      });
    }
  }, [db]);

  return (
    <>
      <PageHeader
        title="Blog Posts"
        description="Manage all articles and news for the website."
      >
        <Button asChild>
          <Link href="/admin/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </PageHeader>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <BlogPostsTable posts={posts} />
      )}
    </>
  );
}
