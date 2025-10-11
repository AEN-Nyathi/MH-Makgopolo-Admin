import { getTestimonials } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { TestimonialsTable } from './components/testimonials-table';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Review and publish submissions from clients."
      />
      <TestimonialsTable testimonials={testimonials} />
    </>
  );
}
