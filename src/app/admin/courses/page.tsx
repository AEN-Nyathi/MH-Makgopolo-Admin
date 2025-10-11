import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getCourses } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/page-header';
import { CoursesTable } from './components/courses-table';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();

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
      <CoursesTable courses={courses} />
    </>
  );
}
