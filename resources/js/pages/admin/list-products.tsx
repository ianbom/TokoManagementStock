import { Head } from '@inertiajs/react';
import {
    IconAlertTriangle,
    IconBox,
    IconPackage,
    IconPackageOff,
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
import { products as adminProducts } from '@/routes/admin';

type ProductRow = {
    id: number;
    name: string;
    sku: string;
    business: string;
    stock: number;
    price: number;
    status: 'available' | 'low' | 'out';
};

type Props = {
    summary: {
        total: AdminMetric;
        available: AdminMetric;
        low_stock: AdminMetric;
        out_of_stock: AdminMetric;
    };
    rows: AdminPaginator<ProductRow>;
    filters: AdminFilters;
};

const number = new Intl.NumberFormat('id-ID');
const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
const statusLabels = {
    available: 'Tersedia',
    low: 'Menipis',
    out: 'Habis',
};

const columns: ColumnDef<ProductRow>[] = [
    {
        accessorKey: 'name',
        header: 'Produk',
        cell: ({ row }) => (
            <div>
                <p className="font-medium">{row.original.name}</p>
                <p className="text-xs text-muted-foreground">
                    {row.original.sku}
                </p>
            </div>
        ),
    },
    { accessorKey: 'business', header: 'Bisnis' },
    { accessorKey: 'stock', header: 'Stok' },
    {
        accessorKey: 'price',
        header: 'Harga Jual',
        cell: ({ row }) => currency.format(row.original.price),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.status === 'available'
                        ? 'secondary'
                        : 'outline'
                }
            >
                {statusLabels[row.original.status]}
            </Badge>
        ),
    },
];

export default function AdminListProducts({ summary, rows, filters }: Props) {
    const kpis: AdminKpi[] = [
        {
            label: 'Total Produk',
            value: number.format(summary.total.value),
            description: 'Produk terdaftar',
            change: summary.total.change,
            icon: IconPackage,
        },
        {
            label: 'Stok Tersedia',
            value: number.format(summary.available.value),
            description: 'Stok dalam kondisi aman',
            change: summary.available.change,
            icon: IconBox,
        },
        {
            label: 'Stok Menipis',
            value: number.format(summary.low_stock.value),
            description: 'Perlu segera dipantau',
            change: summary.low_stock.change,
            icon: IconAlertTriangle,
        },
        {
            label: 'Stok Habis',
            value: number.format(summary.out_of_stock.value),
            description: 'Produk tidak tersedia',
            change: summary.out_of_stock.change,
            icon: IconPackageOff,
        },
    ];

    return (
        <>
            <Head title="Produk Admin" />
            <AdminListPage
                kpis={kpis}
                rows={rows}
                filters={filters}
                columns={columns}
                routeUrl={adminProducts().url}
                tableTitle="Daftar Produk"
                tableDescription="Produk dari seluruh bisnis platform"
                searchPlaceholder="Cari produk atau bisnis..."
            />
        </>
    );
}
