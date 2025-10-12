export type Course = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  grade_level: string;
  duration: string;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  image_url?: string;
  requirements?: string;
  certification?: string;
  job_prospects?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
};

export type Testimonial = {
  id: string;
  student_name: string;
  current_position: string;
  testimonial_text: string;
  is_approved: boolean;
  is_featured: boolean;
  submission_date: string;
  rating?: number;
};

export type RegistrationStatus = 'New' | 'Contacted' | 'Enrolled';

export type CourseRegistration = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  id_number: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  course_interest: string;
  submission_date: string;
  status: RegistrationStatus;
};

export type ContactStatus = 'New' | 'Followed Up' | 'Archived';

export type ContactSubmission = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  course_interest?: string;
  submission_date: string;
  status: ContactStatus;
};

export type GalleryCategory = 'training' | 'graduates' | 'facilities' | 'events';

export type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
  category: GalleryCategory;
  description?: string;
  is_active: boolean;
  created_at: string;
};
