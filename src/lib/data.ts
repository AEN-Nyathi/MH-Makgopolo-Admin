import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Firestore,
  DocumentReference,
} from 'firebase/firestore';
import type {
  Course,
  BlogPost,
  Testimonial,
  CourseRegistration,
  ContactSubmission,
  RegistrationStatus,
  ContactStatus,
  GalleryImage,
} from '@/lib/types';

const getCollection = async <T>(db: Firestore, collectionName: string): Promise<T[]> => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

const getDocumentById = async <T>(
  db: Firestore,
  collectionName: string,
  id: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as T;
  } catch (error) {
    console.error(`Error fetching document ${id} from ${collectionName}:`, error);
    return null;
  }
};

// --- Firestore data access ---

// Courses
export const getCourses = (db: Firestore): Promise<Course[]> => getCollection<Course>(db, 'courses');
export const getCourseById = (db: Firestore, id: string): Promise<Course | null> => getDocumentById<Course>(db, 'courses', id);

export const saveCourse = async (db: Firestore, course: Partial<Omit<Course, 'created_at'>>) => {
  const { id, ...updateData } = course;
  if (id) {
    await updateDoc(doc(db, 'courses', id), updateData);
    return { id, ...updateData };
  } else {
    const newCourse = { ...updateData, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'courses'), newCourse);
    return { id: docRef.id, ...newCourse };
  }
};

export const deleteCourse = (db: Firestore, id: string) => deleteDoc(doc(db, 'courses', id));

// Blog Posts
export const getBlogPosts = (db: Firestore): Promise<BlogPost[]> => getCollection<BlogPost>(db, 'blog_posts');
export const getBlogPostById = (db: Firestore, id: string): Promise<BlogPost | null> => getDocumentById<BlogPost>(db, 'blog_posts', id);

export const saveBlogPost = async (db: Firestore, post: Partial<Omit<BlogPost, 'created_at'>>) => {
  const { id, ...updateData } = post;
  if (id) {
    await updateDoc(doc(db, 'blog_posts', id), updateData);
    return { id, ...updateData };
  } else {
    const newPost = { ...updateData, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'blog_posts'), newPost);
    return { id: docRef.id, ...newPost };
  }
};

export const deleteBlogPost = (db: Firestore, id: string) => deleteDoc(doc(db, 'blog_posts', id));

// Testimonials
export const getTestimonials = (db: Firestore): Promise<Testimonial[]> => getCollection<Testimonial>(db, 'testimonials');

export const saveTestimonial = async (db: Firestore, testimonial: Partial<Omit<Testimonial, 'submission_date'>>) => {
    const { id, ...updateData } = testimonial;
    if (id) {
      await updateDoc(doc(db, 'testimonials', id), updateData);
      return { id, ...updateData };
    } else {
      const newTestimonial = { ...updateData, submission_date: new Date().toISOString() };
      const docRef = await addDoc(collection(db, 'testimonials'), newTestimonial);
      return { id: docRef.id, ...newTestimonial };
    }
  };

export const updateTestimonialApproval = (db: Firestore, id: string, is_approved: boolean) => {
  return updateDoc(doc(db, 'testimonials', id), { is_approved });
};

// Registrations
export const getCourseRegistrations = (db: Firestore): Promise<CourseRegistration[]> => getCollection<CourseRegistration>(db, 'registrations');

export const updateRegistrationStatus = (db: Firestore, id: string, status: RegistrationStatus) => {
  return updateDoc(doc(db, 'registrations', id), { status });
};

// Contact Submissions
export const getContactSubmissions = (db: Firestore): Promise<ContactSubmission[]> => getCollection<ContactSubmission>(db, 'contact_submissions');

export const updateContactStatus = (db: Firestore, id: string, status: ContactStatus) => {
  return updateDoc(doc(db, 'contact_submissions', id), { status });
};

// Gallery Images
export const getGalleryImages = (db: Firestore): Promise<GalleryImage[]> => getCollection<GalleryImage>(db, 'gallery_images');
export const getGalleryImageById = (db: Firestore, id: string): Promise<GalleryImage | null> => getDocumentById<GalleryImage>(db, 'gallery_images', id);

export const saveGalleryImage = async (db: Firestore, image: Partial<Omit<GalleryImage, 'created_at'>>) => {
  const { id, ...updateData } = image;
  if (id) {
    await updateDoc(doc(db, 'gallery_images', id), updateData);
    return { id, ...updateData };
  } else {
    const newImage = { ...updateData, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'gallery_images'), newImage);
    return { id: docRef.id, ...newImage };
  }
};

export const deleteGalleryImage = (db: Firestore, id: string) => deleteDoc(doc(db, 'gallery_images', id));