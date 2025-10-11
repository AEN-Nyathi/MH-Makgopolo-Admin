'use client';

import { useState } from 'react';
import { ContactSubmission } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { MoreHorizontal, Eye } from 'lucide-react';
import { ViewMessageDialog } from './view-message-dialog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/admin/status-badge';
import type { ContactStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { updateContactStatus } from '../actions';

interface StatusSelectProps {
    submissionId: string;
    initialStatus: ContactStatus;
}
  
function StatusSelect({ submissionId, initialStatus }: StatusSelectProps) {
    const [status, setStatus] = useState<ContactStatus>(initialStatus);
    const { toast } = useToast();
  
    const handleStatusChange = async (newStatus: ContactStatus) => {
      setStatus(newStatus);
      const result = await updateContactStatus(submissionId, newStatus);
      if (!result.success) {
        setStatus(status); // Revert on failure
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: `Status updated to ${newStatus}.` });
      }
    };
  
    return (
      <Select onValueChange={handleStatusChange} defaultValue={status}>
        <SelectTrigger className="w-[140px] h-8">
            <SelectValue asChild><StatusBadge status={status} /></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Followed Up">Followed Up</SelectItem>
          <SelectItem value="Archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    );
}

interface ContactLeadsTableProps {
  submissions: ContactSubmission[];
}

export function ContactLeadsTable({ submissions }: ContactLeadsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.full_name}</TableCell>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{sub.phone}</TableCell>
                  <TableCell>{formatDate(sub.submission_date)}</TableCell>
                  <TableCell><StatusSelect submissionId={sub.id} initialStatus={sub.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedSubmission(sub)}>
                          <Eye className="mr-2 h-4 w-4" /> View Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">No contact submissions found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ViewMessageDialog
        submission={selectedSubmission}
        isOpen={!!selectedSubmission}
        onOpenChange={(isOpen) => !isOpen && setSelectedSubmission(null)}
      />
    </>
  );
}
