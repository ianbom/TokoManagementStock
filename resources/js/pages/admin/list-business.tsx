import { Head } from '@inertiajs/react';
import {
    IconBuildingStore,
    IconCircleCheck,
    IconShoppingCart,
    IconTruckDelivery,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import AdminListPage from '@/components/admin/admin-list-page';
import type {
    AdminFilters,
    AdminKpi,
    AdminMetric,
    AdminPaginator,
} from '@/components/admin/admin-list-page';
import { Badge } from '@/components/ui/badge';
import { businesses as adminBusinesses } from '@/routes/admin';

type BusinessRow = {
    id: number;
    code: string;
    name: string;
    type: 'store' | 'supplier';
    owner: string;
    address: string;
    users: number;
    products: number;
    status: 'active' | 'inactive';
};

type Props = {
    summary: {
        total: AdminMetric;
        stores: AdminMetric;
        suppliers: AdminMetric;
        active: AdminMetric;
    };
    rows: AdminPaginator<BusinessRow>;
    filters: AdminFilters;
};

const number = new Intl.NumberFormat('id-ID');
const columns: ColumnDef<BusinessRow>[] = [
    {
        accessorKey: 'name',
        header: 'Bisnis',
        cell: ({ row }) => (
            <div>
                <p className="font-medium">{row.original.name}</p>
                <p className="text-xs text-muted-foreground">
                    {row.original.code}
                </p>
            </div>
        ),
    },
    {
        accessorKey: 'type',
        header: 'Jenis',
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.type === 'store' ? 'Toko' : 'Supplier'}
            </Badge>
        ),
    },
    {
        accessorKey: 'owner',
        header: 'Pemilik',
        cell: ({ row }) => (
            <div>
                <p>{row.original.owner}</p>
                <p className="max-w-56 truncate text-xs text-muted-foreground">
                    {row.original.address}
                </p>
            </div>
        ),
    },
    { accessorKey: 'users', header: 'Pengguna' },
    { accessorKey: 'products', header: 'Produk' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.status === 'active' ? 'secondary' : 'outline'
                }
            >
                {row.original.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
            </Badge>
        ),
    },
];

export default function AdminListBusiness({ summary, rows, filters }: Props) {
    const kpis: AdminKpi[] = [
        {
            label: 'Total Bisnis',
            value: number.format(summary.total.value),
            description: 'Bisnis terdaftar',
            change: summary.total.change,
            icon: IconBuildingStore,
        },
        {
            label: 'Toko',
            value: number.format(summary.stores.value),
            description: 'Toko pada platform',
            change: summary.stores.change,
            icon: IconShoppingCart,
        },
        {
            label: 'Supplier',
            value: number.format(summary.suppliers.value),
            description: 'Supplier pada platform',
            change: summary.suppliers.change,
            icon: IconTruckDelivery,
        },
        {
            label: 'Bisnis Aktif',
            value: number.format(summary.active.value),
            description: 'Bertransaksi dalam 30 hari',
            change: summary.active.change,
            icon: IconCircleCheck,
        },
    ];

    return (
        <>
            <Head title="Bisnis Admin" />
            <AdminListPage
                kpis={kpis}
                rows={rows}
                filters={filters}
                columns={columns}
                routeUrl={adminBusinesses().url}
                tableTitle="Daftar Bisnis"
                tableDescription="Toko dan supplier terdaftar pada platform"
                searchPlaceholder="Cari bisnis, pemilik, atau alamat..."
            />
        </>
    );
}
