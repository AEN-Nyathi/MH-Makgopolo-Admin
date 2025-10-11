import { PageHeader } from '@/components/admin/page-header';
import { TestimonialForm } from '../components/testimonial-form';

export default function NewTestimonialPage() {
  return (
    <>
      <PageHeader
        title="New Testimonial"
        description="Add a new client testimonial to the system."
      />
      <TestimonialForm />
    </>
  );
}
