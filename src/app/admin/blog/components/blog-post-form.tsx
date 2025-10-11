'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { createOrUpdateBlogPost } from '@/app/admin/blog/actions';
import type { BlogPost } from '@/lib/types';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  slug: z.string().optional(),
  author: z.string().min(2, 'Author name is required'),
  category: z.string().min(2, 'Category is required'),
  excerpt: z.string().min(10, 'Excerpt is too short'),
  content: z.string().min(20, 'Content is too short'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  published_at: z.date(),
  is_published: z.boolean(),
});

type BlogPostFormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  initialData?: BlogPost | null;
}

export function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { ...initialData, published_at: new Date(initialData.published_at) } : {
      title: '', slug: '', author: 'Admin', category: '', excerpt: '', content: '', image_url: '',
      published_at: new Date(), is_published: false,
    },
  });

  const { formState } = form;

  const onSubmit = async (data: BlogPostFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'published_at' && value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });
    if (initialData?.id) {
        formData.append('id', initialData.id);
    }
    
    const result = await createOrUpdateBlogPost(formData);
    
    if (result.success) {
      toast({ title: `Blog post ${initialData ? 'updated' : 'created'} successfully!` });
      router.push('/admin/blog');
      router.refresh();
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        form.setError(field as keyof BlogPostFormValues, { type: 'server', message: (messages as string[]).join(', ') });
      });
      toast({ title: 'Please correct the errors below.', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Blog Post Title" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="auto-generated if blank" {...field} /></FormControl><FormDescription>URL-friendly version of the title.</FormDescription><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="excerpt" render={({ field }) => (
                  <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea placeholder="A brief summary of the post." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="content" render={({ field }) => (
                  <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea rows={10} placeholder="Full post content. Markdown is supported." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader><CardTitle>Properties</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="is_published" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><FormLabel>Published</FormLabel><FormDescription>Is this post visible to the public?</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="published_at" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Publish Date</FormLabel>
                    <Popover><PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                    </PopoverContent>
                    </Popover>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="author" render={({ field }) => (
                  <FormItem><FormLabel>Author</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Best Practices" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="image_url" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Saving...' : 'Save Post'}</Button>
        </div>
      </form>
    </Form>
  );
}
