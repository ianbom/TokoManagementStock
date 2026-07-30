import type { CSSProperties, ReactNode } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AdminHeader from '@/layouts/admin/header';
import AdminSidebar from '@/layouts/admin/sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': '18rem',
                    '--header-height': '3.5rem',
                } as CSSProperties
            }
        >
            <AdminSidebar />
            <SidebarInset>
                <AdminHeader />
                <main className="flex flex-1 flex-col">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
