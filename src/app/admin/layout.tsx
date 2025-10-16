import Link from 'next/link';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/admin/main-nav';
import { UserNav } from '@/components/admin/user-nav';
import logo from '@/assets/images/logo.png'
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="h-16 justify-center p-4">
            <Link href="/admin" className="flex items-center gap-3">
                <Image src={logo} alt="MH Makgopolo Logo" width={40} height={40} className="block group-data-[collapsible=icon]:hidden" />
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="font-headline font-bold text-xl text-sidebar-foreground">MH Makgopolo</span>
                    <span className="text-xs text-sidebar-foreground/80">Admin Center</span>
                </div>
                <Image src={logo} alt="MH Makgopolo Logo" width={32} height={32} className="hidden group-data-[collapsible=icon]:block" />
            </Link>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
