'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateTestimonial } from '@/app/admin/testimonials/actions';
import type { Testimonial } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  client_name: z.string().min(2, 'Client name is required'),
  client_role: z.string().min(2, 'Client role is required'),
  text: z.string().min(10, 'Testimonial text is too short'),
  is_approved: z.boolean(),
});

type TestimonialFormValues = z.infer<typeof formSchema>;

interface TestimonialFormProps {
  initialData?: Testimonial | null;
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { ...initialData } : {
      client_name: '',
      client_role: '',
      text: '',
      is_approved: false,
    },
  });

  const { formState } = form;

  const onSubmit = async (data: TestimonialFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (initialData?.id) {
        formData.append('id', initialData.id);
    }
    
    const result = await createOrUpdateTestimonial(formData);
    
    if (result.success) {
      toast({ title: `Testimonial ${initialData ? 'updated' : 'created'} successfully!` });
      router.push('/admin/testimonials');
      router.refresh();
    } else if (result.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        form.setError(field as keyof TestimonialFormValues, { type: 'server', message: (messages as string[]).join(', ') });
      });
      toast({ title: 'Please correct the errors below.', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader><CardTitle>{initialData ? 'Edit Testimonial' : 'New Testimonial'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="client_name" render={({ field }) => (
                    <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input placeholder="e.g., Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="client_role" render={({ field }) => (
                    <FormItem><FormLabel>Client Role / Company</FormLabel><FormControl><Input placeholder="e.g., CEO at Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="text" render={({ field }) => (
                    <FormItem><FormLabel>Testimonial Text</FormLabel><FormControl><Textarea rows={6} placeholder="Full testimonial content." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="is_approved" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><FormLabel>Approved</FormLabel><FormDescription>Is this testimonial approved for public display?</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? 'Saving...' : 'Save Testimonial'}</Button>
        </div>
      </form>
    </Form>
  );
}
