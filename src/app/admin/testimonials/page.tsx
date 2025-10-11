'use client';

import { useState, useEffect } from 'react';
import { getTestimonials } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { TestimonialsTable } from './components/testimonials-table';
import { useFirestore } from '@/firebase';
import { Testimonial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TestimonialsPage() {
  const db = useFirestore();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getTestimonials(db).then(data => {
        setTestimonials(data);
        setLoading(false);
      });
    }
  }, [db]);

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Review and publish submissions from clients."
      />
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <TestimonialsTable testimonials={testimonials} />
      )}
    </>
  );
}
