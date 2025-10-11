import type { Course, BlogPost, Testimonial, CourseRegistration, ContactSubmission, RegistrationStatus, ContactStatus } from '@/lib/types';
import { subDays, formatISO } from 'date-fns';

// In-memory data stores
let courses: Course[] = [
  { id: '1', title: 'Grade E Security Training', slug: 'grade-e-security-training', short_description: 'Foundational course for new security officers.', full_description: 'This course covers all the basic requirements for a Grade E security officer, including patrolling, access control, and emergency procedures.', grade_level: 'Grade E', duration: '5 Days', price: 1500, is_active: true, created_at: formatISO(subDays(new Date(), 2)) },
  { id: '2', title: 'Grade D Security Training', slug: 'grade-d-security-training', short_description: 'Intermediate course for experienced officers.', full_description: 'Building on Grade E, this course adds skills in supervision and more complex security scenarios.', grade_level: 'Grade D', duration: '5 Days', price: 1800, is_active: true, created_at: formatISO(subDays(new Date(), 5)) },
  { id: '3', title: 'Advanced CCTV Operation', slug: 'advanced-cctv-operation', short_description: 'Master modern surveillance systems.', full_description: 'Learn to operate and manage complex CCTV systems, including analytics and evidence gathering.', grade_level: 'Specialized', duration: '3 Days', price: 2500, is_active: false, created_at: formatISO(subDays(new Date(), 10)) },
];

let blogPosts: BlogPost[] = [
    { id: '1', title: 'The Importance of Regular Security Patrols', slug: 'importance-of-regular-patrols', author: 'John Doe', category: 'Best Practices', excerpt: 'Discover why consistent patrols are the backbone of effective security.', content: 'Full blog content goes here...', image_url: 'https://picsum.photos/seed/sec1/800/600', published_at: formatISO(subDays(new Date(), 3)), is_published: true, created_at: formatISO(subDays(new Date(), 4)) },
    { id: '2', title: 'Top 5 Skills for a Modern Security Officer', slug: 'top-5-skills-security-officer', author: 'Jane Smith', category: 'Career Tips', excerpt: 'From tech-savviness to communication, what skills do you need to succeed?', content: 'Full blog content goes here...', image_url: 'https://picsum.photos/seed/sec2/800/600', published_at: formatISO(subDays(new Date(), 10)), is_published: true, created_at: formatISO(subDays(new Date(), 11)) },
];

let testimonials: Testimonial[] = [
    { id: '1', client_name: 'David Molefe', client_role: 'Grade D Graduate', text: 'The training was excellent and very practical. I feel much more confident in my role now.', is_approved: true, submission_date: formatISO(subDays(new Date(), 7)) },
    { id: '2', client_name: 'Sarah Jones', client_role: 'Site Manager', text: 'MH-Makgopolo provides top-notch guards. Their training is clearly effective.', is_approved: false, submission_date: formatISO(subDays(new Date(), 2)) },
];

let courseRegistrations: CourseRegistration[] = [
    { id: '1', full_name: 'Peter Williams', phone: '082-123-4567', email: 'peter@example.com', course_interest: 'Grade E Security Training', submission_date: formatISO(subDays(new Date(), 1)), status: 'New' },
    { id: '2', full_name: 'Thabo Mbeki', phone: '073-987-6543', email: 'thabo@example.com', course_interest: 'Advanced CCTV Operation', submission_date: formatISO(subDays(new Date(), 3)), status: 'Contacted' },
];

let contactSubmissions: ContactSubmission[] = [
    { id: '1', full_name: 'Corporate Solutions Inc.', email: 'hr@csi.com', phone: '011-555-0000', message: 'We are interested in a bulk training package for 20 of our new recruits.', submission_date: formatISO(subDays(new Date(), 1)), status: 'New' },
];

// --- Simulation of API/DB calls ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Courses
export const getCourses = async () => (await delay(100), courses);
export const getCourseById = async (id: string) => (await delay(100), courses.find(c => c.id === id));
export const saveCourse = async (course: Omit<Course, 'created_at'>) => {
  await delay(500);
  if (course.id) {
    courses = courses.map(c => c.id === course.id ? { ...c, ...course } : c);
    return courses.find(c => c.id === course.id);
  } else {
    const newCourse = { ...course, id: String(Date.now()), created_at: formatISO(new Date()) };
    courses.unshift(newCourse);
    return newCourse;
  }
};
export const deleteCourse = async (id: string) => {
  await delay(500);
  courses = courses.filter(c => c.id !== id);
  return { success: true };
};

// Blog Posts
export const getBlogPosts = async () => (await delay(100), blogPosts);
export const getBlogPostById = async (id: string) => (await delay(100), blogPosts.find(p => p.id === id));
export const saveBlogPost = async (post: Omit<BlogPost, 'created_at'>) => {
  await delay(500);
  if (post.id) {
    blogPosts = blogPosts.map(p => p.id === post.id ? { ...p, ...post } : p);
    return blogPosts.find(p => p.id === post.id);
  } else {
    const newPost = { ...post, id: String(Date.now()), created_at: formatISO(new Date()) };
    blogPosts.unshift(newPost);
    return newPost;
  }
};
export const deleteBlogPost = async (id: string) => {
    await delay(500);
    blogPosts = blogPosts.filter(p => p.id !== id);
    return { success: true };
};


// Testimonials
export const getTestimonials = async () => (await delay(100), testimonials);
export const updateTestimonialApproval = async (id: string, is_approved: boolean) => {
    await delay(300);
    testimonials = testimonials.map(t => t.id === id ? { ...t, is_approved } : t);
    return testimonials.find(t => t.id === id);
}

// Registrations
export const getCourseRegistrations = async () => (await delay(100), courseRegistrations);
export const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    await delay(300);
    courseRegistrations = courseRegistrations.map(r => r.id === id ? { ...r, status } : r);
    return courseRegistrations.find(r => r.id === id);
};

// Contact Submissions
export const getContactSubmissions = async () => (await delay(100), contactSubmissions);
export const updateContactStatus = async (id: string, status: ContactStatus) => {
    await delay(300);
    contactSubmissions = contactSubmissions.map(s => s.id === id ? { ...s, status } : s);
    return contactSubmissions.find(s => s.id === id);
};
