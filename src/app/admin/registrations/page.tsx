'use client';

import { useState, useEffect } from 'react';
import { getCourseRegistrations } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { RegistrationsTable } from './components/registrations-table';
import { ExportButton } from './components/export-button';
import { useFirestore } from '@/firebase';
import { CourseRegistration } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function RegistrationsPage() {
  const db = useFirestore();
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getCourseRegistrations(db).then(data => {
        setRegistrations(data);
        setLoading(false);
      });
    }
  }, [db]);

  return (
    <>
      <PageHeader
        title="Course Registrations"
        description="View and manage all course registration submissions."
      >
        <ExportButton data={registrations} />
      </PageHeader>
      {loading ? (
        <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <RegistrationsTable registrations={registrations} />
      )}
    </>
  );
}
