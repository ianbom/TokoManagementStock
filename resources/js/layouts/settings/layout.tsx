import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <div className="px-5 pt-8">
            <div className="rounded-[20px] bg-[#0e223e] px-5 py-5 text-white shadow-[0_8px_20px_rgba(14,34,62,0.12)]">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />
            </div>

            <nav
                className="mt-5 grid grid-cols-3 gap-2 rounded-[18px] bg-white p-2 shadow-[0_4px_14px_rgba(14,34,62,0.04)]"
                aria-label="Settings"
            >
                {sidebarNavItems.map((item, index) => (
                    <Link
                        key={`${toUrl(item.href)}-${index}`}
                        href={item.href}
                        prefetch
                        className={cn(
                            'flex min-h-11 items-center justify-center rounded-[13px] px-2 text-center text-[11px] font-medium transition-colors',
                            isCurrentUrl(item.href)
                                ? 'bg-[#fdb900] text-[#121212] shadow-[0_4px_10px_rgba(253,185,0,0.20)]'
                                : 'text-[#858585] hover:bg-[#fff5d8] hover:text-[#252525]',
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
            </nav>

            <section className="mt-5 space-y-10 rounded-[20px] bg-white p-5 shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                {children}
            </section>
        </div>
    );
}
