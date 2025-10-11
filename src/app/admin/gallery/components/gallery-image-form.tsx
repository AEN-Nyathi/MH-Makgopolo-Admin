'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateGalleryImage } from '@/app/admin/gallery/actions';
import type { GalleryImage, GalleryCategory } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  image_url: z.string().url('Must be a valid URL'),
  category: z.enum(['training', 'graduates', 'facilities', 'events']),
  is_active: z.boolean(),
});

type GalleryImageFormValues = z.infer<typeof formSchema>;

interface GalleryImageFormProps {
  initialData?: GalleryImage | null;
}

export function GalleryImageForm({ initialData }: GalleryImageFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<GalleryImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      image_url: '',
      category: 'training',
      is_active: true,
    },
  });

  const { formState } = form;

  const onSubmit = async (data: GalleryImageFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    if (initialData?.id) {
        formData.append('id', initialData.id);
    }
    
    const result = await createOrUpdateGalleryImage(formData);
    
    if (result.success) {
      toast({ title: `Gallery image ${initialData ? 'updated' : 'created'} successfully!` });
      router.push('/admin/gallery');
      router.refresh();
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        form.setError(field as keyof GalleryImageFormValues, { type: 'server', message: (messages as string[]).join(', ') });
      });
      toast({ title: 'Please correct the errors below.', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>{initialData ? 'Edit Image' : 'New Image'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Image Title" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="image_url" render={({ field }) => (
              <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief description of the image." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="graduates">Graduates</SelectItem>
                    <SelectItem value="facilities">Facilities</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="is_active" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5"><FormLabel>Visible</FormLabel><FormDescription>Should this image be visible in the public gallery?</FormDescription></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )} />
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Saving...' : 'Save Image'}</Button>
        </div>
      </form>
    </Form>
  );
}
