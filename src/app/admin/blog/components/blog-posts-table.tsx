'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { toggleBlogPostStatus, deleteBlogPost } from '@/app/admin/blog/actions';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/admin/status-badge';

interface StatusSwitchProps {
  postId: string;
  initialIsPublished: boolean;
}

function StatusSwitch({ postId, initialIsPublished }: StatusSwitchProps) {
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const { toast } = useToast();

  const handleToggle = async () => {
    const newStatus = !isPublished;
    setIsPublished(newStatus);
    const result = await toggleBlogPostStatus(postId, !newStatus);
    if (!result.success) {
      setIsPublished(!newStatus);
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Post status updated.` });
    }
  };

  return <Switch checked={isPublished} onCheckedChange={handleToggle} />;
}

interface BlogPostsTableProps {
  posts: BlogPost[];
}

export function BlogPostsTable({ posts }: BlogPostsTableProps) {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const openDeleteDialog = (postId: string) => {
    setPostToDelete(postId);
    setDeleteAlertOpen(true);
  };

  const handleDelete = async () => {
    if (postToDelete) {
      const result = await deleteBlogPost(postToDelete);
      if (result.success) {
        toast({ title: 'Success', description: 'Blog post deleted.' });
        router.refresh();
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
      setPostToDelete(null);
      setDeleteAlertOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell><Badge variant="outline">{post.category}</Badge></TableCell>
                  <TableCell>{formatDate(post.published_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={post.is_published ? 'Published' : 'Draft'} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/admin/blog/${post.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDeleteDialog(post.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">No blog posts found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the blog post.</AlertDialogDescription>
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
