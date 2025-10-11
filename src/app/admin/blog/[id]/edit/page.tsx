import { getBlogPostById } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { BlogPostForm } from '../../components/blog-post-form';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(params.id);

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
