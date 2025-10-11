'use client';

import { CourseRegistration } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { StatusSelect } from './status-select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RegistrationsTableProps {
  registrations: CourseRegistration[];
}

export function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Course Interest</TableHead>
            <TableHead>Submitted On</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.length > 0 ? (
            registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell className="font-medium">{reg.full_name}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.phone}</TableCell>
                <TableCell>{reg.course_interest}</TableCell>
                <TableCell>{formatDate(reg.submission_date)}</TableCell>
                <TableCell>
                  <StatusSelect registrationId={reg.id} initialStatus={reg.status} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No course registrations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
