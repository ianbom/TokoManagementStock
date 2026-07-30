import { Head } from '@inertiajs/react';
import {
    IconCash,
    IconCircleCheck,
    IconClock,
    IconReceipt,
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
import { transactions as adminTransactions } from '@/routes/admin';

type TransactionRow = {
    key: string;
    id: number;
    invoice: string;
    business: string;
    type: 'pos' | 'supplier_purchase';
    amount: number;
    status: 'completed' | 'pending' | 'cancelled';
    occurredAt: string;
};

type Props = {
    summary: {
        total: AdminMetric;
        completed: AdminMetric;
        pending: AdminMetric;
        value: AdminMetric;
    };
    rows: AdminPaginator<TransactionRow>;
    filters: AdminFilters;
};

const number = new Intl.NumberFormat('id-ID');
const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
const date = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
});
const statusLabels = {
    completed: 'Selesai',
    pending: 'Pending',
    cancelled: 'Dibatalkan',
};
const columns: ColumnDef<TransactionRow>[] = [
    {
        accessorKey: 'invoice',
        header: 'Invoice',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.invoice}</span>
        ),
    },
    { accessorKey: 'business', header: 'Bisnis' },
    {
        accessorKey: 'type',
        header: 'Tipe',
        cell: ({ row }) =>
            row.original.type === 'pos' ? 'POS' : 'Pembelian Supplier',
    },
    {
        accessorKey: 'amount',
        header: 'Nominal',
        cell: ({ row }) => currency.format(row.original.amount),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.status === 'completed'
                        ? 'secondary'
                        : 'outline'
                }
            >
                {statusLabels[row.original.status]}
            </Badge>
        ),
    },
    {
        accessorKey: 'occurredAt',
        header: 'Tanggal',
        cell: ({ row }) => date.format(new Date(row.original.occurredAt)),
    },
];

export default function AdminListTransaction({
    summary,
    rows,
    filters,
}: Props) {
    const kpis: AdminKpi[] = [
        {
            label: 'Total Transaksi',
            value: number.format(summary.total.value),
            description: 'Transaksi bulan ini',
            change: summary.total.change,
            icon: IconReceipt,
        },
        {
            label: 'Transaksi Selesai',
            value: number.format(summary.completed.value),
            description: 'Berhasil diproses',
            change: summary.completed.change,
            icon: IconCircleCheck,
        },
        {
            label: 'Transaksi Pending',
            value: number.format(summary.pending.value),
            description: 'Menunggu penyelesaian',
            change: summary.pending.change,
            icon: IconClock,
        },
        {
            label: 'Nilai Transaksi',
            value: currency.format(summary.value.value),
            description: 'Transaksi selesai bulan ini',
            change: summary.value.change,
            icon: IconCash,
        },
    ];

    return (
        <>
            <Head title="Transaksi Admin" />
            <AdminListPage
                kpis={kpis}
                rows={rows}
                filters={filters}
                columns={columns}
                routeUrl={adminTransactions().url}
                tableTitle="Daftar Transaksi"
                tableDescription="Transaksi POS dan pembelian supplier"
                searchPlaceholder="Cari invoice, bisnis, atau tipe..."
            />
        </>
    );
}
