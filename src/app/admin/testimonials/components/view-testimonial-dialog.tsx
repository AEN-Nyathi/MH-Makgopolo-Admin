'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Testimonial } from '@/lib/types';
import { toggleTestimonialApproval } from '@/app/admin/testimonials/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ViewTestimonialDialogProps {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ViewTestimonialDialog({ testimonial, isOpen, onOpenChange }: ViewTestimonialDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!testimonial) return null;

  const handleApprovalToggle = async (approve: boolean) => {
    setIsSubmitting(true);
    // Ensure we are setting the status to the desired state, not just toggling
    if (testimonial.is_approved !== approve) {
      const result = await toggleTestimonialApproval(testimonial.id, !approve);
      if (result.success) {
        toast({ title: 'Success', description: `Testimonial has been ${approve ? 'approved' : 'unapproved'}.` });
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    }
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Testimonial from {testimonial.student_name}</DialogTitle>
          <DialogDescription>{testimonial.current_position}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground leading-relaxed italic">"{testimonial.testimonial_text}"</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Close</Button>
          {!testimonial.is_approved ? (
            <Button onClick={() => handleApprovalToggle(true)} disabled={isSubmitting}>
              {isSubmitting ? 'Approving...' : 'Approve'}
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => handleApprovalToggle(false)} disabled={isSubmitting}>
              {isSubmitting ? 'Unapproving...' : 'Unapprove'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
