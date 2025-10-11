import { PageHeader } from '@/components/admin/page-header';
import { CourseForm } from '../components/course-form';

export default function NewCoursePage() {
  return (
    <>
      <PageHeader
        title="New Course"
        description="Fill out the form to add a new course to the website."
      />
      <CourseForm />
    </>
  );
}
