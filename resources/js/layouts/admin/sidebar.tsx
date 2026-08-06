import { Link, usePage } from '@inertiajs/react';
import {
    IconBuildingStore,
    IconChevronUp,
    IconDashboard,
    IconLogout,
    IconPackage,
    IconReceipt,
    IconShieldCheck,
    IconUsers,
} from '@tabler/icons-react';
import type { ComponentType } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { logout } from '@/routes';
import {
    businesses,
    dashboard as adminDashboard,
    products,
    transactions,
    users,
} from '@/routes/admin';

const adminItems: Array<{
    title: string;
    icon: ComponentType<{ className?: string }>;
    href?: string;
    component?: string;
}> = [
    {
        title: 'Dashboard',
        icon: IconDashboard,
        href: adminDashboard().url,
        component: 'admin/dashboard',
    },
    {
        title: 'Bisnis',
        icon: IconBuildingStore,
        href: businesses().url,
        component: 'admin/list-business',
    },
    {
        title: 'Pengguna',
        icon: IconUsers,
        href: users().url,
        component: 'admin/list-users',
    },
    {
        title: 'Produk',
        icon: IconPackage,
        href: products().url,
        component: 'admin/list-products',
    },
    {
        title: 'Transaksi',
        icon: IconReceipt,
        href: transactions().url,
        component: 'admin/list-transaction',
    },
];

export default function AdminSidebar() {
    const page = usePage();
    const user = page.props.auth.user;
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={adminDashboard().url}>
                                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <IconShieldCheck className="size-5" />
                                </span>
                                <span className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        StockFlow
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Admin Console
                                    </span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {item.href ? (
                                            <SidebarMenuButton
                                                isActive={
                                                    page.component ===
                                                    item.component
                                                }
                                                asChild
                                            >
                                                <Link href={item.href}>
                                                    <Icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton
                                                disabled
                                                tooltip={`${item.title} segera hadir`}
                                            >
                                                <Icon />
                                                <span>{item.title}</span>
                                                <span className="ml-auto text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                                                    Segera
                                                </span>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg">
                                    <Avatar className="size-8 rounded-lg">
                                        <AvatarImage
                                            src={user.photo_url ?? undefined}
                                            alt={`Foto profil ${user.name}`}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </span>
                                    <IconChevronUp className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="end"
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                            >
                                <DropdownMenuLabel>
                                    Administrator
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
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
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
