import { getContactSubmissions } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { ContactLeadsTable } from './components/contact-leads-table';

export const dynamic = 'force-dynamic';

export default async function ContactLeadsPage() {
  const submissions = await getContactSubmissions();

  return (
    <>
      <PageHeader
        title="Contact Submissions"
        description="View and manage leads from the website's contact form."
      />
      <ContactLeadsTable submissions={submissions} />
    </>
  );
}
