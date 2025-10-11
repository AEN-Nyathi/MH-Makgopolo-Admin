'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCsv } from '@/lib/utils';
import { CourseRegistration } from '@/lib/types';

interface ExportButtonProps {
  data: CourseRegistration[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    const filename = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(data, filename);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export to CSV
    </Button>
  );
}
