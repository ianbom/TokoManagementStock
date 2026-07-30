import { Head } from '@inertiajs/react';
import {
    IconBuildingStore,
    IconPackage,
    IconReceipt,
    IconUsers,
} from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';
import AdminListPage from '@/components/admin/admin-list-page';
import type {
    AdminFilters,
    AdminKpi,
    AdminMetric,
    AdminPaginator,
} from '@/components/admin/admin-list-page';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard as adminDashboard } from '@/routes/admin';

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

type GrowthPoint = {
    month: string;
    label: string;
    store: number;
    supplier: number;
};

type Props = {
    metrics: {
        total_businesses: AdminMetric;
        total_users: AdminMetric;
        total_products: AdminMetric;
        transactions_this_month: AdminMetric;
    };
    growth: GrowthPoint[];
    businesses: AdminPaginator<BusinessRow>;
    filters: AdminFilters;
};

const number = new Intl.NumberFormat('id-ID');
const columns: ColumnDef<BusinessRow>[] = [
    {
        accessorKey: 'name',
        header: 'Nama Bisnis',
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
        cell: ({ row }) =>
            row.original.type === 'store' ? 'Toko' : 'Supplier',
    },
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
    { accessorKey: 'users', header: 'Pengguna' },
    { accessorKey: 'products', header: 'Produk' },
];

export default function AdminDashboard({
    metrics,
    growth,
    businesses,
    filters,
}: Props) {
    const [period, setPeriod] = useState('12');
    const visibleGrowth = growth.slice(-Number(period));
    const kpis: AdminKpi[] = [
        {
            label: 'Total Bisnis',
            value: number.format(metrics.total_businesses.value),
            description: 'Bisnis terdaftar',
            change: metrics.total_businesses.change,
            icon: IconBuildingStore,
        },
        {
            label: 'Total Pengguna',
            value: number.format(metrics.total_users.value),
            description: 'Akun pada platform',
            change: metrics.total_users.change,
            icon: IconUsers,
        },
        {
            label: 'Total Produk',
            value: number.format(metrics.total_products.value),
            description: 'Produk terdaftar',
            change: metrics.total_products.change,
            icon: IconPackage,
        },
        {
            label: 'Transaksi Bulan Ini',
            value: number.format(metrics.transactions_this_month.value),
            description: 'POS dan pembelian supplier',
            change: metrics.transactions_this_month.change,
            icon: IconReceipt,
        },
    ];

    return (
        <>
            <Head title="Dashboard Admin" />
            <AdminListPage
                kpis={kpis}
                rows={businesses}
                filters={filters}
                columns={columns}
                routeUrl={adminDashboard().url}
                tableTitle="Bisnis Terbaru"
                tableDescription="Bisnis terbaru yang terdaftar pada platform"
                searchPlaceholder="Cari bisnis..."
            >
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>Pertumbuhan Platform</CardTitle>
                            <CardDescription>
                                Akumulasi toko dan supplier terdaftar
                            </CardDescription>
                        </div>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger
                                className="w-36"
                                aria-label="Periode chart"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="12">12 bulan</SelectItem>
                                    <SelectItem value="6">6 bulan</SelectItem>
                                    <SelectItem value="3">3 bulan</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visibleGrowth}>
                                <defs>
                                    <linearGradient
                                        id="store"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--chart-1)"
                                            stopOpacity={0.4}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--chart-1)"
                                            stopOpacity={0.04}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="supplier"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--chart-2)"
                                            stopOpacity={0.35}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--chart-2)"
                                            stopOpacity={0.04}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="store"
                                    name="Toko"
                                    stroke="var(--chart-1)"
                                    fill="url(#store)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="supplier"
                                    name="Supplier"
                                    stroke="var(--chart-2)"
                                    fill="url(#supplier)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </AdminListPage>
        </>
    );
}
