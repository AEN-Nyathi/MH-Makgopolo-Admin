import { getCourseRegistrations } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { RegistrationsTable } from './components/registrations-table';
import { ExportButton } from './components/export-button';

export const dynamic = 'force-dynamic';

export default async function RegistrationsPage() {
  const registrations = await getCourseRegistrations();

  return (
    <>
      <PageHeader
        title="Course Registrations"
        description="View and manage all course registration submissions."
      >
        <ExportButton data={registrations} />
      </PageHeader>
      <RegistrationsTable registrations={registrations} />
    </>
  );
}
