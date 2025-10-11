import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getBlogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { BlogPostsTable } from './components/blog-posts-table';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getBlogPosts();

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
      <BlogPostsTable posts={posts} />
    </>
  );
}
