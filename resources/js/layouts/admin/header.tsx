import { Link, usePage } from '@inertiajs/react';
import { IconBell, IconLogout, IconUserCircle } from '@tabler/icons-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { logout } from '@/routes';

const pageHeaders: Record<string, { title: string; description: string }> = {
    'admin/dashboard': {
        title: 'Dashboard Admin',
        description: 'Pantau aktivitas platform StockFlow',
    },
    'admin/list-business': {
        title: 'Manajemen Bisnis',
        description: 'Kelola data toko dan supplier platform',
    },
    'admin/list-users': {
        title: 'Manajemen Pengguna',
        description: 'Pantau akun dan peran pengguna platform',
    },
    'admin/list-products': {
        title: 'Manajemen Produk',
        description: 'Pantau produk dan kondisi stok seluruh bisnis',
    },
    'admin/list-transaction': {
        title: 'Manajemen Transaksi',
        description: 'Pantau aktivitas transaksi pada platform',
    },
};

export default function AdminHeader() {
    const page = usePage();
    const user = page.props.auth.user;
    const header =
        pageHeaders[page.component] ?? pageHeaders['admin/dashboard'];
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-1 h-4" />
            <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold sm:text-base">
                    {header.title}
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                    {header.description}
                </p>
            </div>

            <div className="ml-auto flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Notifikasi"
                >
                    <IconBell />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Menu akun admin"
                        >
                            <Avatar className="size-8">
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs font-normal text-muted-foreground">
                                {user.email}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                            <IconUserCircle />
                            Profil admin
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={logout()}
                                method="post"
                                as="button"
                                className="w-full"
                            >
                                <IconLogout />
                                Keluar
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
