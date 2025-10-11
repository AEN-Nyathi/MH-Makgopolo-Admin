'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Eye } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { toggleTestimonialApproval } from '@/app/admin/testimonials/actions';
import { ViewTestimonialDialog } from './view-testimonial-dialog';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { StatusBadge } from '@/components/admin/status-badge';

interface StatusSwitchProps {
  testimonialId: string;
  initialIsApproved: boolean;
}

function StatusSwitch({ testimonialId, initialIsApproved }: StatusSwitchProps) {
  const [isApproved, setIsApproved] = useState(initialIsApproved);
  const { toast } = useToast();

  const handleToggle = async () => {
    const newStatus = !isApproved;
    setIsApproved(newStatus); // Optimistic update
    const result = await toggleTestimonialApproval(testimonialId, !newStatus);
    if (!result.success) {
      setIsApproved(!newStatus); // Revert on failure
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Testimonial status updated.` });
    }
  };

  return <Switch checked={isApproved} onCheckedChange={handleToggle} />;
}

interface TestimonialsTableProps {
  testimonials: Testimonial[];
}

export function TestimonialsTable({ testimonials }: TestimonialsTableProps) {
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  return (
    <>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Role / Title</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">{testimonial.client_name}</TableCell>
                <TableCell>{testimonial.client_role}</TableCell>
                <TableCell>{formatDate(testimonial.submission_date)}</TableCell>
                <TableCell>
                  <StatusBadge status={testimonial.is_approved ? 'Approved' : 'Pending'} />
                </TableCell>
                <TableCell>
                  <StatusSwitch testimonialId={testimonial.id} initialIsApproved={testimonial.is_approved} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTestimonial(testimonial)}>
                        <Eye className="mr-2 h-4 w-4" /> View Full Text
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={6} className="h-24 text-center">No testimonials found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <ViewTestimonialDialog 
        testimonial={selectedTestimonial}
        isOpen={!!selectedTestimonial}
        onOpenChange={(isOpen) => !isOpen && setSelectedTestimonial(null)}
    />
    </>
  );
}
