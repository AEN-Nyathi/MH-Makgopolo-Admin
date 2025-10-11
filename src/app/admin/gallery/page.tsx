'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getGalleryImages } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { GalleryImagesTable } from './components/gallery-images-table';
import { useFirestore } from '@/firebase';
import { GalleryImage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryPage() {
  const db = useFirestore();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getGalleryImages(db).then(data => {
        setImages(data);
        setLoading(false);
      });
    }
  }, [db]);

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Manage all images for the website's gallery."
      >
        <Button asChild>
          <Link href="/admin/gallery/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Image
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
        <GalleryImagesTable images={images} />
      )}
    </>
  );
}
