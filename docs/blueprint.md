# **App Name**: MH Admin Center

## Core Features:

- Dashboard Overview: Provides a high-level summary of key operational metrics, including course registrations, contact submissions, and active courses.
- Course Management: Enables CRUD operations for courses, managing details such as title, description, grade level, duration, price, and status.
- Blog Post Management: Facilitates CRUD operations for blog posts, allowing management of title, author, category, excerpt, content, publication date, and status.
- Testimonial Management: Allows review and approval of testimonial submissions, with options to read full text and approve or reject testimonials.
- Course Registrations Management: Provides read-only viewing and in-line status updates for course registrations, including options to export data to CSV.
- Contact Submissions Management: Enables read-only viewing and in-line status updates for contact submissions, with a dedicated view to read full messages.
- Automatic Slug Generation: Automatically generate a slug from the title when creating or updating Courses and Blog Posts if the slug is empty.

## Style Guidelines:

- Primary color: Navy blue (#003049) to maintain consistency with the existing public website.
- Background color: Light blue-gray (#E6EBF2) to create a clean and functional dashboard aesthetic.
- Accent color: Orange (#D62828) for CTAs and important UI elements, providing contrast and focus.
- Body font: 'Inter' (sans-serif) for clear and modern readability throughout the dashboard.
- Headline font: 'Space Grotesk' (sans-serif) for a techy feel to call out Titles. Paired with Inter for body text.
- Use simple, professional icons from Shadcn/ui's library to represent different modules and actions within the dashboard.
- Implement a responsive sidebar and dashboard layout using Tailwind CSS to ensure usability across different screen sizes.