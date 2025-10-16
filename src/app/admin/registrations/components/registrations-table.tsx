'use client';

import { CourseRegistration } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { StatusSelect } from './status-select';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);


interface RegistrationsTableProps {
  registrations: CourseRegistration[];
}

export function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  
  const getWhatsAppMessage = (status: string, course: string, name: string) => {
    const studentName = name.split(' ')[0]; // Use first name
    switch (status) {
      case 'New':
        return `Hi ${studentName}, this is a confirmation from MH Makgopolo Security. We've received your registration for the ${course} course. We'll be in touch with the next steps shortly.`;
      case 'Contacted':
        return `Hi ${studentName}, following up on your registration for the ${course} course at MH Makgopolo Security. Do you have any questions we can help with?`;
      case 'Enrolled':
        return `Hi ${studentName}, welcome to MH Makgopolo Security! We're excited to have you enrolled in the ${course} course. Here are the details for your first day...`;
      default:
        return `Hi ${studentName}, regarding your application for the ${course} course at MH Makgopolo Security...`;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Course Interest</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.length > 0 ? (
            registrations.map((reg) => {
              const message = getWhatsAppMessage(reg.status, reg.course, reg.fullName);
              const whatsappUrl = `https://wa.me/${reg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
              
              return (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium">{reg.fullName}</TableCell>
                  <TableCell>{reg.email}</TableCell>
                  <TableCell>{reg.phone}</TableCell>
                  <TableCell>{reg.idNumber}</TableCell>
                  <TableCell>{reg.course}</TableCell>
                  <TableCell>{formatDate(reg.createdAt)}</TableCell>
                  <TableCell>
                    <StatusSelect registrationId={reg.id} initialStatus={reg.status} />
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon">
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Send WhatsApp Message">
                        <WhatsAppIcon />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No course registrations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
