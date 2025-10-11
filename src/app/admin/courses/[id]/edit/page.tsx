import { getCourseById } from '@/lib/data';
import { PageHeader } from '@/components/admin/page-header';
import { CourseForm } from '../../components/course-form';

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await getCourseById(params.id);

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
