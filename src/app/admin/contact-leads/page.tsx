'use client';

import { useState, useEffect } from 'react';
import { getContactSubmissions } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { ContactLeadsTable } from './components/contact-leads-table';
import { useFirestore } from '@/firebase';
import { ContactSubmission } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactLeadsPage() {
  const db = useFirestore();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getContactSubmissions(db).then(data => {
        setSubmissions(data);
        setLoading(false);
      });
    }
  }, [db]);

  return (
    <>
      <PageHeader
        title="Contact Submissions"
        description="View and manage leads from the website's contact form."
      />
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <ContactLeadsTable submissions={submissions} />
      )}
    </>
  );
}
