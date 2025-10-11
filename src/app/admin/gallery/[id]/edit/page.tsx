'use client';

import { useEffect, useState } from 'react';
import { getGalleryImageById } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { GalleryImageForm } from '../../components/gallery-image-form';
import { useFirestore } from '@/firebase';
import type { GalleryImage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const db = useFirestore();
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getGalleryImageById(db, params.id).then((data) => {
        setImage(data);
        setLoading(false);
      });
    }
  }, [db, params.id]);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Edit Gallery Image"
          description="Update the details of this gallery image."
        />
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </>
    );
  }

  if (!image) {
    return <div>Image not found.</div>;
  }

  return (
    <>
      <PageHeader
        title="Edit Gallery Image"
        description="Update the details of this gallery image."
      />
      <GalleryImageForm initialData={image} />
    </>
  );
}
