'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BookCopy,
  MailCheck,
  Star,
  UserCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { getCourses, getCourseRegistrations, getContactSubmissions, getTestimonials } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/admin/status-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import type { Course, CourseRegistration, ContactSubmission, Testimonial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const db = useFirestore();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  useEffect(() => {
    if (!db) return;
    
    const fetchData = async () => {
      setLoading(true);
      const [coursesData, registrationsData, contactsData, testimonialsData] = await Promise.all([
        getCourses(db),
        getCourseRegistrations(db),
        getContactSubmissions(db),
        getTestimonials(db)
      ]);
      setCourses(coursesData);
      setRegistrations(registrationsData);
      setContacts(contactsData);
      setTestimonials(testimonialsData);
      setLoading(false);
    };

    fetchData();
  }, [db]);


  const totalRegistrations = registrations.length;
  const totalContacts = contacts.length;
  const activeCourses = courses.filter(c => c.is_active).length;
  const pendingTestimonials = testimonials.filter(t => !t.is_approved).length;

  const recentRegistrations = registrations.slice(0, 5);
  const recentTestimonials = testimonials.filter(t => !t.is_approved).slice(0, 5);

  if (loading) {
    return (
        <>
        <PageHeader
            title="Dashboard"
            description="A high-level summary of key operational metrics."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader><CardTitle>Recent Course Registrations</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-32 w-full" /></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Testimonials Awaiting Review</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-32 w-full" /></CardContent>
            </Card>
        </div>
        </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A high-level summary of key operational metrics."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Course Registrations
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Submissions
            </CardTitle>
            <MailCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">Total new leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              of {courses.length} total courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Testimonials for Review
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTestimonials}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Course Registrations</CardTitle>
            <CardDescription>
              The latest 5 people to register for a course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.full_name}</TableCell>
                    <TableCell>{reg.course_interest}</TableCell>
                    <TableCell><StatusBadge status={reg.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
                <Button asChild variant="link">
                    <Link href="/admin/registrations">View All</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Testimonials Awaiting Review</CardTitle>
            <CardDescription>
              The latest 5 testimonials that need your approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTestimonials.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.client_name}</TableCell>
                    <TableCell>{test.client_role}</TableCell>
                    <TableCell>{formatDate(test.submission_date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
                <Button asChild variant="link">
                    <Link href="/admin/testimonials">View All</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
