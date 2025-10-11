'use client';

import { useEffect, useState } from 'react';
import { getCourseById } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { CourseForm } from '../../components/course-form';
import { useFirestore } from '@/firebase';
import type { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const db = useFirestore();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getCourseById(db, params.id).then((data) => {
        setCourse(data);
        setLoading(false);
      });
    }
  }, [db, params.id]);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Edit Course"
          description="Update the details for this course."
        />
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </>
    );
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <>
      <PageHeader
        title="Edit Course"
        description="Update the details for this course."
      />
      <CourseForm initialData={course} />
    </>
  );
}
