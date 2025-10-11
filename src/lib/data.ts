import { db } from '@/firebase/server';
import type { Course, BlogPost, Testimonial, CourseRegistration, ContactSubmission, RegistrationStatus, ContactStatus } from '@/lib/types';
import { subDays, formatISO } from 'date-fns';

const getCollection = async <T>(collectionName: string): Promise<T[]> => {
    try {
        const snapshot = await db.collection(collectionName).get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return [];
    }
}

const getDocumentById = async <T>(collectionName: string, id: string): Promise<T | null> => {
    try {
        const doc = await db.collection(collectionName).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as T;
    } catch (error) {
        console.error(`Error fetching document ${id} from ${collectionName}:`, error);
        return null;
    }
}

// --- Firestore data access ---

// Courses
export const getCourses = async () => getCollection<Course>('courses');
export const getCourseById = async (id: string) => getDocumentById<Course>('courses', id);

export const saveCourse = async (course: Partial<Omit<Course, 'created_at'>>) => {
    const { id, ...updateData } = course;
    if (id) {
        await db.collection('courses').doc(id).update(updateData);
        return { id, ...updateData };
    } else {
        const newCourse = { ...updateData, created_at: new Date().toISOString() };
        const docRef = await db.collection('courses').add(newCourse);
        return { id: docRef.id, ...newCourse };
    }
};

export const deleteCourse = async (id: string) => {
    await db.collection('courses').doc(id).delete();
    return { success: true };
};

// Blog Posts
export const getBlogPosts = async () => getCollection<BlogPost>('blog_posts');
export const getBlogPostById = async (id: string) => getDocumentById<BlogPost>('blog_posts', id);

export const saveBlogPost = async (post: Partial<Omit<BlogPost, 'created_at'>>) => {
    const { id, ...updateData } = post;
    if (id) {
        await db.collection('blog_posts').doc(id).update(updateData);
        return { id, ...updateData };
    } else {
        const newPost = { ...updateData, created_at: new Date().toISOString() };
        const docRef = await db.collection('blog_posts').add(newPost);
        return { id: docRef.id, ...newPost };
    }
};

export const deleteBlogPost = async (id: string) => {
    await db.collection('blog_posts').doc(id).delete();
    return { success: true };
};

// Testimonials
export const getTestimonials = async () => getCollection<Testimonial>('testimonials');

export const updateTestimonialApproval = async (id: string, is_approved: boolean) => {
    await db.collection('testimonials').doc(id).update({ is_approved });
    const updatedTestimonial = await getDocumentById<Testimonial>('testimonials', id);
    return updatedTestimonial;
}

// Registrations
export const getCourseRegistrations = async () => getCollection<CourseRegistration>('course_registrations');

export const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    await db.collection('course_registrations').doc(id).update({ status });
    const updatedRegistration = await getDocumentById<CourseRegistration>('course_registrations', id);
    return updatedRegistration;
};

// Contact Submissions
export const getContactSubmissions = async () => getCollection<ContactSubmission>('contact_submissions');

export const updateContactStatus = async (id: string, status: ContactStatus) => {
    await db.collection('contact_submissions').doc(id).update({ status });
    const updatedSubmission = await getDocumentById<ContactSubmission>('contact_submissions', id);
    return updatedSubmission;
};
