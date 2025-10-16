'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateRegistrationStatus } from '@/app/admin/registrations/actions';
import type { RegistrationStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/admin/status-badge';

interface StatusSelectProps {
  registrationId: string;
  initialStatus: RegistrationStatus;
}

export function StatusSelect({ registrationId, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState<RegistrationStatus>(initialStatus);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: RegistrationStatus) => {
    setStatus(newStatus);
    const result = await updateRegistrationStatus(registrationId, newStatus);
    if (!result.success) {
      setStatus(status); // Revert on failure
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Status updated to ${newStatus}.` });
    }
  };

  return (
    <Select onValueChange={handleStatusChange} defaultValue={status}>
      <SelectTrigger className="w-[130px] h-8">
        <SelectValue>
          <StatusBadge status={status} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="New">New</SelectItem>
        <SelectItem value="Contacted">Contacted</SelectItem>
        <SelectItem value="Enrolled">Enrolled</SelectItem>
      </SelectContent>
    </Select>
  );
}
