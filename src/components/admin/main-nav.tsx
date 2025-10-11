'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookCopy,
  Newspaper,
  Star,
  UserCheck,
  MailCheck,
  ShieldCheck,
  GalleryHorizontal,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: BookCopy },
  { href: '/admin/blog', label: 'Blog Posts', icon: Newspaper },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
  { href: '/admin/registrations', label: 'Registrations', icon: UserCheck },
  { href: '/admin/contact-leads', label: 'Contact Leads', icon: MailCheck },
];

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col', className)}>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}
                tooltip={{ children: item.label }}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
