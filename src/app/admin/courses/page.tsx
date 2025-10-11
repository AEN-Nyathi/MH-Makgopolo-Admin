'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getCourses } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { CoursesTable } from './components/courses-table';
import { useFirestore } from '@/firebase';
import { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoursesPage() {
  const db = useFirestore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getCourses(db).then((data) => {
        setCourses(data);
        setLoading(false);
      });
    }
  }, [db]);


  return (
    <>
      <PageHeader
        title="Courses"
        description="Manage all security training courses."
      >
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Course
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
        <CoursesTable courses={courses} />
      )}
    </>
  );
}
