'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { GalleryImage } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { deleteGalleryImage } from '@/app/admin/gallery/actions';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/admin/status-badge';

interface GalleryImagesTableProps {
  images: GalleryImage[];
}

export function GalleryImagesTable({ images }: GalleryImagesTableProps) {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const openDeleteDialog = (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteAlertOpen(true);
  };

  const handleDelete = async () => {
    if (imageToDelete) {
      const result = await deleteGalleryImage(imageToDelete);
      if (result.success) {
        toast({ title: 'Success', description: 'Gallery image deleted.' });
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
      setImageToDelete(null);
      setDeleteAlertOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.length > 0 ? (
              images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <Image 
                      src={image.image_url}
                      alt={image.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{image.title}</TableCell>
                  <TableCell><Badge variant="outline">{image.category}</Badge></TableCell>
                  <TableCell>{formatDate(image.created_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={image.is_active ? 'Active' : 'Inactive'} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/admin/gallery/${image.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDeleteDialog(image.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">No gallery images found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the image from the gallery.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
