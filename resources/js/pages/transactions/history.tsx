import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowDownToLine,
    ArrowLeft,
    ArrowUp,
    ArrowUpDown,
    ArrowUpRight,
    Bell,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    LoaderCircle,
    PackageSearch,
    RefreshCcw,
    ShoppingCart,
    SlidersHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    index,
    show,
} from '@/actions/App/Http/Controllers/TransactionHistoryController';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dashboard } from '@/routes';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';

type TransactionType = 'in' | 'out' | 'supplier';
type TransactionFilters = {
    search: string;
    type: 'all' | TransactionType;
    period: 'today' | 'week' | 'month';
    sort: 'latest' | 'oldest';
};
type Transaction = {
    id: number;
    title: string;
    product_name: string;
    quantity: number;
    occurred_at: string;
    source_label: string;
    type: TransactionType;
};
type DocumentItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
};
type TransactionDocument = {
    kind: 'sale' | 'business_order';
    number: string;
    customer_name?: string | null;
    partner_name?: string | null;
    notes: string | null;
    status: string;
    completed_at: string | null;
    total: number;
    items: DocumentItem[];
};
type TransactionDetail = Transaction & {
    stock_before: number;
    stock_after: number;
    description: string | null;
    operator_name: string | null;
    image_url: string | null;
    document: TransactionDocument | null;
};
type PaginatedTransactions = {
    data: Transaction[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
};
type Props = {
    transactions: PaginatedTransactions;
    summary: {
        total: number;
        stock_in: number;
        stock_out: number;
    };
    filters: TransactionFilters;
};

const transactionStyles: Record<
    TransactionType,
    {
        icon: LucideIcon;
        iconClass: string;
        amountClass: string;
        badge: string;
        badgeClass: string;
    }
> = {
    in: {
        icon: ArrowDownToLine,
        iconClass: 'bg-[linear-gradient(145deg,#18c8ac_0%,#00a989_100%)]',
        amountClass: 'text-[#009f80]',
        badge: 'Masuk',
        badgeClass: 'bg-[#dff6ef] text-[#008f76]',
    },
    out: {
        icon: ArrowUpRight,
        iconClass: 'bg-[linear-gradient(145deg,#f02a1d_0%,#d80000_100%)]',
        amountClass: 'text-[#df0808]',
        badge: 'Keluar',
        badgeClass: 'bg-[#ffe3e3] text-[#df0808]',
    },
    supplier: {
        icon: ShoppingCart,
        iconClass: 'bg-[linear-gradient(145deg,#165ce4_0%,#003fc2_100%)]',
        amountClass: 'text-[#009f80]',
        badge: 'Supplier',
        badgeClass: 'bg-[#e1ebff] text-[#004bd4]',
    },
};

const filterButton =
    'h-[25px] rounded-[7px] border border-[#dddddd] bg-white px-2 text-[9px] font-medium text-[#252525] shadow-[0_1px_2px_rgba(14,34,62,0.02)]';

export default function TransactionHistory({
    transactions,
    summary,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detail, setDetail] = useState<TransactionDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState('');

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            updateFilters(filters, { search });
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters, search]);

    const openDetail = async (transactionId: number) => {
        setDialogOpen(true);
        setDetail(null);
        setDetailError('');
        setDetailLoading(true);

        try {
            const response = await fetch(show(transactionId).url, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error('Detail transaksi tidak dapat dimuat.');
            }

            const payload = (await response.json()) as {
                transaction: TransactionDetail;
            };
            setDetail(payload.transaction);
        } catch {
            setDetailError('Detail transaksi tidak dapat dimuat. Coba lagi.');
        } finally {
            setDetailLoading(false);
        }
    };

    const hasActiveFilters =
        filters.search !== '' ||
        filters.type !== 'all' ||
        filters.period !== 'today' ||
        filters.sort !== 'latest';
    const activeFilterCount =
        Number(filters.type !== 'all') + Number(filters.period !== 'today');

    return (
        <>
            <Head title="Riwayat Transaksi" />

            <AppPageHeader
                backgroundImage={heroImage}
                overlayClassName="bg-[rgba(8,31,58,0.86)]"
                className="h-[170px] rounded-b-[29px] bg-[position:65%_center] px-3.5 pt-3.5 text-white"
            >
                <div className="relative flex items-center justify-between">
                    <Link
                        href={dashboard().url}
                        aria-label="Kembali ke dashboard"
                        className="flex size-8 items-center justify-center rounded-[10px] bg-white/20 backdrop-blur-[2px]"
                    >
                        <ArrowLeft
                            aria-hidden="true"
                            className="size-5"
                            strokeWidth={2.2}
                        />
                    </Link>
                    <button
                        type="button"
                        aria-label="Buka notifikasi"
                        className="relative flex size-8 items-center justify-center rounded-[10px] bg-white/20 backdrop-blur-[2px]"
                    >
                        <Bell
                            aria-hidden="true"
                            className="size-[17px] fill-white text-white"
                            strokeWidth={1.8}
                        />
                        <span className="absolute top-[7px] right-[7px] size-[6px] rounded-full bg-[#ed1717]" />
                    </button>
                </div>
                <div className="relative mt-2">
                    <AppPageHeaderHeading
                        title="Riwayat Transaksi"
                        description="Pantau semua aktivitas stok toko Anda"
                        titleClassName="text-[22px] leading-6 font-bold tracking-[-0.5px]"
                        descriptionClassName="mt-0.5 text-[11px] leading-4 text-white/95"
                    />

                    <AppPageHeaderSearch
                        aria-label="Cari produk atau supplier"
                        placeholder="Cari produk atau supplier"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        wrapperClassName="mt-[9px] flex h-[43px] items-center rounded-[16px] bg-white px-4 text-[#333] shadow-[0_3px_12px_rgba(2,20,43,0.05)]"
                        iconClassName="size-[21px] shrink-0"
                        inputClassName="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#858585]"
                    />
                </div>
            </AppPageHeader>

            <section className="min-h-[455px] bg-[#fff9e8] pt-[9px] pb-4">
                <div className="rounded-[18px] bg-white px-3.5 py-2.5 shadow-[0_6px_18px_rgba(253,185,0,0.08)]">
                    <div className="flex items-center justify-between gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Pilih filter transaksi"
                                    className={`${filterButton} flex min-w-[86px] items-center justify-center gap-1.5 ${activeFilterCount > 0 ? 'border-[#ffbd00] bg-[#fff7dc] text-[#d88900]' : ''}`}
                                >
                                    <SlidersHorizontal
                                        aria-hidden="true"
                                        className="size-[14px]"
                                    />
                                    Filter
                                    {activeFilterCount > 0 && (
                                        <span className="flex size-4 items-center justify-center rounded-full bg-[#ffbd00] text-[8px] font-bold text-[#121212]">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-56 rounded-[14px]"
                            >
                                <DropdownMenuLabel>
                                    Tipe Transaksi
                                </DropdownMenuLabel>
                                <DropdownMenuRadioGroup
                                    value={filters.type}
                                    onValueChange={(value) =>
                                        updateFilters(filters, {
                                            type: value as TransactionFilters['type'],
                                        })
                                    }
                                >
                                    <DropdownMenuRadioItem value="all">
                                        Semua Transaksi
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="in">
                                        Stock Masuk
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="out">
                                        Stock Keluar
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="supplier">
                                        Pembelian Supplier
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Periode</DropdownMenuLabel>
                                <DropdownMenuRadioGroup
                                    value={filters.period}
                                    onValueChange={(value) =>
                                        updateFilters(filters, {
                                            period: value as TransactionFilters['period'],
                                        })
                                    }
                                >
                                    <DropdownMenuRadioItem value="today">
                                        Hari Ini
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="week">
                                        Minggu Ini
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="month">
                                        Bulan Ini
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button
                            type="button"
                            aria-label={`Urutkan transaksi: ${filters.sort === 'latest' ? 'terbaru' : 'terlama'}`}
                            onClick={() =>
                                updateFilters(filters, {
                                    sort:
                                        filters.sort === 'latest'
                                            ? 'oldest'
                                            : 'latest',
                                })
                            }
                            className={`${filterButton} flex min-w-[101px] items-center justify-center gap-1.5`}
                        >
                            <ArrowUpDown
                                aria-hidden="true"
                                className="size-[14px]"
                            />
                            {filters.sort === 'latest' ? 'Terbaru' : 'Terlama'}
                        </button>
                    </div>
                </div>

                <div className="mx-2.5 mt-2 grid h-[59px] grid-cols-3 rounded-[15px] bg-white px-3 shadow-[0_5px_14px_rgba(14,34,62,0.04)]">
                    <SummaryItem
                        icon={ClipboardList}
                        iconClass="bg-[#fff1cf] text-[#ffa600]"
                        label="Total Transaksi"
                        value={summary.total.toLocaleString('id-ID')}
                        valueClass="text-[#0e223e]"
                    />
                    <SummaryItem
                        icon={ArrowDown}
                        iconClass="bg-[#dcf5ed] text-[#009f80]"
                        label="Stock Masuk"
                        value={summary.stock_in.toLocaleString('id-ID')}
                        valueClass="text-[#009f80]"
                        bordered
                    />
                    <SummaryItem
                        icon={ArrowUp}
                        iconClass="bg-[#ffe0e0] text-[#df0808]"
                        label="Stock Keluar"
                        value={summary.stock_out.toLocaleString('id-ID')}
                        valueClass="text-[#df0808]"
                        bordered
                    />
                </div>

                <div className="px-2.5 pt-[7px] pb-1.5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-[13px] leading-4 font-bold text-[#252525]">
                                Daftar Transaksi
                            </h2>
                            <p
                                className={`mt-1 flex items-center gap-1.5 text-[9px] font-medium ${hasActiveFilters ? 'text-[#ff9900]' : 'text-[#858585]'}`}
                            >
                                <SlidersHorizontal
                                    aria-hidden="true"
                                    className="size-3.5"
                                />
                                {hasActiveFilters
                                    ? 'Filter Aktif'
                                    : 'Filter Default'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                updateFilters(filters, {
                                    search: '',
                                    type: 'all',
                                    period: 'today',
                                    sort: 'latest',
                                });
                            }}
                            className="flex items-center gap-1.5 pt-0.5 text-[9px] font-medium text-[#ff9900]"
                        >
                            <RefreshCcw
                                aria-hidden="true"
                                className="size-3.5"
                            />
                            Reset Filter
                        </button>
                    </div>

                    {transactions.data.length > 0 ? (
                        <div className="mt-1 space-y-1">
                            {transactions.data.map((transaction) => (
                                <TransactionRow
                                    key={transaction.id}
                                    transaction={transaction}
                                    onClick={() => openDetail(transaction.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 flex min-h-36 flex-col items-center justify-center rounded-[15px] bg-white px-6 text-center shadow-[0_4px_11px_rgba(14,34,62,0.04)]">
                            <PackageSearch className="size-8 text-[#e5a400]" />
                            <p className="mt-2 text-[12px] font-semibold text-[#252525]">
                                Transaksi tidak ditemukan
                            </p>
                            <p className="mt-1 text-[9px] text-[#858585]">
                                Ubah pencarian atau filter untuk melihat data
                                lain.
                            </p>
                        </div>
                    )}

                    {transactions.last_page > 1 && (
                        <div className="mt-3 flex items-center justify-between rounded-[12px] bg-white px-3 py-2 shadow-[0_4px_11px_rgba(14,34,62,0.04)]">
                            <PaginationButton
                                label="Sebelumnya"
                                icon={ChevronLeft}
                                url={transactions.prev_page_url}
                            />
                            <span className="text-[9px] font-medium text-[#858585]">
                                Halaman {transactions.current_page} dari{' '}
                                {transactions.last_page}
                            </span>
                            <PaginationButton
                                label="Berikutnya"
                                icon={ChevronRight}
                                iconAfter
                                url={transactions.next_page_url}
                            />
                        </div>
                    )}
                </div>
            </section>

            <TransactionDetailDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                detail={detail}
                loading={detailLoading}
                error={detailError}
            />
        </>
    );
}

function updateFilters(
    current: TransactionFilters,
    changes: Partial<TransactionFilters>,
) {
    router.get(
        index().url,
        { ...current, ...changes },
        {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        },
    );
}

function SummaryItem({
    icon: Icon,
    iconClass,
    label,
    value,
    valueClass,
    bordered = false,
}: {
    icon: LucideIcon;
    iconClass: string;
    label: string;
    value: string;
    valueClass: string;
    bordered?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-2 ${bordered ? 'border-l border-[#e4e4e4] pl-3' : ''}`}
        >
            <div
                className={`flex size-[31px] shrink-0 items-center justify-center rounded-full ${iconClass}`}
            >
                <Icon
                    aria-hidden="true"
                    className="size-[17px]"
                    strokeWidth={2.3}
                />
            </div>
            <div>
                <p className="text-[9px] leading-3 font-medium whitespace-nowrap text-[#252525]">
                    {label}
                </p>
                <p className={`text-[17px] leading-5 font-bold ${valueClass}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

function TransactionRow({
    transaction,
    onClick,
}: {
    transaction: Transaction;
    onClick: () => void;
}) {
    const style = transactionStyles[transaction.type];
    const Icon = style.icon;
    const sign = transaction.type === 'out' ? '-' : '+';

    return (
        <button
            type="button"
            onClick={onClick}
            className="grid min-h-[54px] w-full grid-cols-[36px_minmax(0,1fr)_52px_49px_12px] items-center gap-2 rounded-[12px] bg-white px-2.5 py-1.5 text-left shadow-[0_4px_11px_rgba(14,34,62,0.04)]"
        >
            <span
                className={`flex size-9 items-center justify-center rounded-[9px] text-white ${style.iconClass}`}
            >
                <Icon
                    aria-hidden="true"
                    className="size-[21px]"
                    strokeWidth={2.1}
                />
            </span>
            <span className="min-w-0">
                <span className="block truncate text-[10px] leading-3.5 font-bold text-[#252525]">
                    {transaction.title}
                </span>
                <span className="block truncate text-[9px] leading-3.5 font-medium text-[#252525]">
                    {transaction.product_name}
                </span>
                <span className="block truncate text-[8px] leading-3 text-[#858585]">
                    {formatTransactionDate(transaction.occurred_at)}
                    <span className="px-1.5">•</span>
                    {transaction.source_label}
                </span>
            </span>
            <span
                className={`text-[9px] font-bold whitespace-nowrap ${style.amountClass}`}
            >
                {sign}
                {transaction.quantity} pcs
            </span>
            <span
                className={`flex h-[23px] items-center justify-center rounded-[7px] text-[8px] font-medium ${style.badgeClass}`}
            >
                {style.badge}
            </span>
            <ChevronRight
                aria-hidden="true"
                className="size-4 text-[#151515]"
                strokeWidth={2.2}
            />
        </button>
    );
}

function PaginationButton({
    label,
    icon: Icon,
    iconAfter = false,
    url,
}: {
    label: string;
    icon: LucideIcon;
    iconAfter?: boolean;
    url: string | null;
}) {
    return (
        <button
            type="button"
            disabled={url === null}
            onClick={() => url && router.visit(url, { preserveScroll: true })}
            className="flex items-center gap-1 text-[9px] font-semibold text-[#e49a00] disabled:text-[#c8c8c8]"
        >
            {!iconAfter && <Icon className="size-3.5" />}
            {label}
            {iconAfter && <Icon className="size-3.5" />}
        </button>
    );
}

function TransactionDetailDialog({
    open,
    onOpenChange,
    detail,
    loading,
    error,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    detail: TransactionDetail | null;
    loading: boolean;
    error: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85dvh] w-[calc(100%-28px)] max-w-[365px] overflow-y-auto rounded-[22px] border-0 bg-[#fff9e8] p-5 text-[#252525]">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-[18px] font-bold">
                        Detail Transaksi
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-[#858585]">
                        Informasi lengkap aktivitas stok
                    </DialogDescription>
                </DialogHeader>

                {loading && (
                    <div className="flex min-h-48 items-center justify-center">
                        <LoaderCircle className="size-7 animate-spin text-[#f3aa00]" />
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-[14px] bg-white px-4 py-8 text-center text-[11px] text-red-600">
                        {error}
                    </div>
                )}

                {!loading && detail && (
                    <TransactionDetailContent detail={detail} />
                )}
            </DialogContent>
        </Dialog>
    );
}

function TransactionDetailContent({ detail }: { detail: TransactionDetail }) {
    const style = transactionStyles[detail.type];
    const Icon = style.icon;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-[16px] bg-white p-3">
                <span
                    className={`flex size-11 items-center justify-center rounded-[12px] text-white ${style.iconClass}`}
                >
                    <Icon className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold">{detail.title}</p>
                    <p className="truncate text-[11px] font-medium">
                        {detail.product_name}
                    </p>
                    <p className="text-[9px] text-[#858585]">
                        {formatTransactionDate(detail.occurred_at)}
                    </p>
                </div>
                <span className={`text-[13px] font-bold ${style.amountClass}`}>
                    {detail.type === 'out' ? '-' : '+'}
                    {detail.quantity} pcs
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-[16px] bg-white p-3 text-[10px]">
                <DetailValue
                    label="Stok Sebelum"
                    value={`${detail.stock_before} pcs`}
                />
                <DetailValue
                    label="Stok Sesudah"
                    value={`${detail.stock_after} pcs`}
                />
                <DetailValue label="Sumber" value={detail.source_label} />
                <DetailValue
                    label="Operator"
                    value={detail.operator_name ?? '-'}
                />
            </div>

            {detail.description && (
                <div className="rounded-[16px] bg-white p-3">
                    <p className="text-[9px] text-[#858585]">Keterangan</p>
                    <p className="mt-1 text-[11px]">{detail.description}</p>
                </div>
            )}

            {detail.document && <DocumentDetail document={detail.document} />}
        </div>
    );
}

function DocumentDetail({ document }: { document: TransactionDocument }) {
    return (
        <div className="rounded-[16px] bg-white p-3">
            <div className="grid grid-cols-2 gap-2 border-b border-[#eeeeee] pb-3 text-[10px]">
                <DetailValue label="Nomor" value={document.number} />
                <DetailValue label="Status" value={document.status} />
                <DetailValue
                    label={document.kind === 'sale' ? 'Pelanggan' : 'Mitra'}
                    value={
                        document.customer_name ?? document.partner_name ?? '-'
                    }
                />
                <DetailValue
                    label="Total"
                    value={formatRupiah(document.total)}
                />
            </div>

            <div className="mt-3 space-y-2">
                {document.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 text-[10px]"
                    >
                        <div className="min-w-0">
                            <p className="truncate font-semibold">
                                {item.name}
                            </p>
                            <p className="text-[9px] text-[#858585]">
                                {item.quantity} × {formatRupiah(item.price)}
                            </p>
                        </div>
                        <p className="shrink-0 font-semibold">
                            {formatRupiah(item.subtotal)}
                        </p>
                    </div>
                ))}
            </div>

            {document.notes && (
                <p className="mt-3 border-t border-[#eeeeee] pt-3 text-[10px] text-[#666666]">
                    Catatan: {document.notes}
                </p>
            )}
        </div>
    );
}

function DetailValue({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="text-[9px] text-[#858585]">{label}</p>
            <p className="mt-0.5 truncate font-semibold">{value}</p>
        </div>
    );
}

function formatTransactionDate(value: string) {
    const date = new Date(value);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const time = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);

    if (date.toDateString() === today.toDateString()) {
        return `Hari ini, ${time}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `Kemarin, ${time}`;
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
}

function formatRupiah(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}
