import { PageHeader } from '@/components/admin/page-header';
import { BlogPostForm } from '../components/blog-post-form';

export default function NewBlogPostPage() {
  return (
    <>
      <PageHeader
        title="New Blog Post"
        description="Write and configure a new article for your audience."
      />
      <BlogPostForm />
    </>
  );
}
