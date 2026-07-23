import { AppBottomNavigation } from '@/components/app-bottom-navigation';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <AppShell>
            <AppContent>{children}</AppContent>
            <AppBottomNavigation />
        </AppShell>
    );
}
