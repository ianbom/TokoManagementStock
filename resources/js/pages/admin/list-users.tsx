import { Head } from '@inertiajs/react';
import {
    IconBuildingStore,
    IconShieldCheck,
    IconTruckDelivery,
    IconUsers,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import AdminListPage from '@/components/admin/admin-list-page';
import type {
    AdminFilters,
    AdminKpi,
    AdminMetric,
    AdminPaginator,
} from '@/components/admin/admin-list-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { users as adminUsers } from '@/routes/admin';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'store' | 'supplier';
    photo_url: string | null;
    business: string;
    status: 'active' | 'pending';
    joinedAt: string;
};

type Props = {
    summary: {
        total: AdminMetric;
        admins: AdminMetric;
        stores: AdminMetric;
        suppliers: AdminMetric;
    };
    rows: AdminPaginator<UserRow>;
    filters: AdminFilters;
};

const number = new Intl.NumberFormat('id-ID');
const date = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});
const roleLabels = { admin: 'Admin', store: 'Toko', supplier: 'Supplier' };
const columns: ColumnDef<UserRow>[] = [
    {
        accessorKey: 'name',
        header: 'Pengguna',
        cell: ({ row }) => {
            const initials = row.original.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                        <AvatarImage
                            src={row.original.photo_url ?? undefined}
                            alt={`Foto profil ${row.original.name}`}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{row.original.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {row.original.email}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'role',
        header: 'Peran',
        cell: ({ row }) => (
            <Badge variant="outline">{roleLabels[row.original.role]}</Badge>
        ),
    },
    { accessorKey: 'business', header: 'Bisnis' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.status === 'active' ? 'secondary' : 'outline'
                }
            >
                {row.original.status === 'active' ? 'Aktif' : 'Menunggu'}
            </Badge>
        ),
    },
    {
        accessorKey: 'joinedAt',
        header: 'Bergabung',
        cell: ({ row }) => date.format(new Date(row.original.joinedAt)),
    },
];

export default function AdminListUsers({ summary, rows, filters }: Props) {
    const kpis: AdminKpi[] = [
        {
            label: 'Total Pengguna',
            value: number.format(summary.total.value),
            description: 'Akun pada platform',
            change: summary.total.change,
            icon: IconUsers,
        },
        {
            label: 'Administrator',
            value: number.format(summary.admins.value),
            description: 'Pengelola sistem',
            change: summary.admins.change,
            icon: IconShieldCheck,
        },
        {
            label: 'Pengguna Toko',
            value: number.format(summary.stores.value),
            description: 'Akun pemilik toko',
            change: summary.stores.change,
            icon: IconBuildingStore,
        },
        {
            label: 'Pengguna Supplier',
            value: number.format(summary.suppliers.value),
            description: 'Akun supplier',
            change: summary.suppliers.change,
            icon: IconTruckDelivery,
        },
    ];

    return (
        <>
            <Head title="Pengguna Admin" />
            <AdminListPage
                kpis={kpis}
                rows={rows}
                filters={filters}
                columns={columns}
                routeUrl={adminUsers().url}
                tableTitle="Daftar Pengguna"
                tableDescription="Akun pengguna terdaftar pada platform"
                searchPlaceholder="Cari nama, email, atau bisnis..."
            />
        </>
    );
}
