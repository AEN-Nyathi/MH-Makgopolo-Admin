import { createClient } from '@/lib/supabase/server';
import type { Course, BlogPost, Testimonial, CourseRegistration, ContactSubmission, RegistrationStatus, ContactStatus } from '@/lib/types';
import { subDays, formatISO } from 'date-fns';

// --- Supabase data access ---

// Courses
export const getCourses = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
    return data;
};

export const getCourseById = async (id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
    if (error) {
        console.error(`Error fetching course ${id}:`, error);
        return null;
    }
    return data;
};

export const saveCourse = async (course: Partial<Omit<Course, 'created_at'>>) => {
    const supabase = createClient();
    const { id, ...updateData } = course;

    if (id) {
        const { data, error } = await supabase.from('courses').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase.from('courses').insert({ ...updateData, created_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        return data;
    }
};

export const deleteCourse = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
};

// Blog Posts
export const getBlogPosts = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
    if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
    return data;
};

export const getBlogPostById = async (id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error) {
        console.error(`Error fetching blog post ${id}:`, error);
        return null;
    }
    return data;
};

export const saveBlogPost = async (post: Partial<Omit<BlogPost, 'created_at'>>) => {
    const supabase = createClient();
    const { id, ...updateData } = post;

    if (id) {
        const { data, error } = await supabase.from('blog_posts').update(updateData).eq('id', id).select().single();
        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase.from('blog_posts').insert({ ...updateData, created_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        return data;
    }
};

export const deleteBlogPost = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
};

// Testimonials
export const getTestimonials = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('testimonials').select('*').order('submission_date', { ascending: false });
     if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
    return data;
};

export const updateTestimonialApproval = async (id: string, is_approved: boolean) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('testimonials').update({ is_approved }).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

// Registrations
export const getCourseRegistrations = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('course_registrations').select('*').order('submission_date', { ascending: false });
    if (error) {
        console.error('Error fetching course registrations:', error);
        return [];
    }
    return data;
};

export const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('course_registrations').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

// Contact Submissions
export const getContactSubmissions = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('contact_submissions').select('*').order('submission_date', { ascending: false });
    if (error) {
        console.error('Error fetching contact submissions:', error);
        return [];
    }
    return data;
};

export const updateContactStatus = async (id: string, status: ContactStatus) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('contact_submissions').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
