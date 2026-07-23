import { Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import historyIcon from '../../../Design/Dashboard/Vector (1).png';
import chatIcon from '../../../Design/Dashboard/Vector (2).png';
import settingsIcon from '../../../Design/Dashboard/Vector (3).png';
import dashboardIcon from '../../../Design/Dashboard/Vector.png';

const navigation = [
    { label: 'Dashboard', icon: dashboardIcon, href: dashboard().url },
    { label: 'Riwayat', icon: historyIcon, href: null },
    { label: 'Obrolan', icon: chatIcon, href: null },
    { label: 'Pengaturan', icon: settingsIcon, href: editProfile().url },
];

export function AppBottomNavigation() {
    const currentPath = usePage().url.split('?')[0];

    return (
        <nav
            aria-label="Navigasi utama"
            className="fixed bottom-0 left-1/2 z-50 grid h-[92px] w-full max-w-[393px] -translate-x-1/2 grid-cols-4 gap-1 rounded-t-[22px] bg-white px-3 pt-2.5 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(14,34,62,0.07)]"
        >
            {navigation.map((item) => {
                const active =
                    item.label === 'Dashboard'
                        ? currentPath === item.href
                        : item.label === 'Pengaturan' &&
                          currentPath.startsWith('/settings');
                const className = [
                    'flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-[16px] text-[9px] leading-3 transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none',
                    active
                        ? 'bg-[#fdb900] font-semibold text-[#121212] shadow-[0_6px_14px_rgba(253,185,0,0.22)]'
                        : 'font-normal text-[#858585]',
                ].join(' ');

                if (!item.href) {
                    return (
                        <button
                            key={item.label}
                            type="button"
                            disabled
                            aria-label={`${item.label} belum tersedia`}
                            className={`${className} cursor-not-allowed opacity-70`}
                        >
                            <img
                                src={item.icon}
                                alt=""
                                className="size-7 object-contain"
                            />
                            <span>{item.label}</span>
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        prefetch
                        aria-current={active ? 'page' : undefined}
                        className={className}
                    >
                        <img
                            src={item.icon}
                            alt=""
                            className="size-7 object-contain"
                        />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
