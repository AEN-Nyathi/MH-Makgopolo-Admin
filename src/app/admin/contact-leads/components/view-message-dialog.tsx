'use client';

import { ContactSubmission } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ViewMessageDialogProps {
  submission: ContactSubmission | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ViewMessageDialog({ submission, isOpen, onOpenChange }: ViewMessageDialogProps) {
  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Message from {submission.full_name}</DialogTitle>
          <DialogDescription>
            Contact: {submission.email} | {submission.phone}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground leading-relaxed">{submission.message}</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
