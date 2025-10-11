import { PageHeader } from '@/components/admin/page-header';
import { GalleryImageForm } from '../components/gallery-image-form';

export default function NewGalleryImagePage() {
  return (
    <>
      <PageHeader
        title="New Gallery Image"
        description="Add a new image to your website gallery."
      />
      <GalleryImageForm />
    </>
  );
}
