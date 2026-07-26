import { Head, Link } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowDownToLine,
    ArrowLeft,
    ArrowUp,
    ArrowUpDown,
    ArrowUpRight,
    Bell,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    RefreshCcw,
    Search,
    ShoppingCart,
    SlidersHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { dashboard } from '@/routes';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';

type TransactionType = 'in' | 'out' | 'supplier';

type Transaction = {
    title: string;
    product: string;
    quantity: string;
    date: string;
    source: string;
    type: TransactionType;
};

const transactions: Transaction[] = [
    {
        title: 'Stock Masuk',
        product: 'Indomie Goreng',
        quantity: '+50 pcs',
        date: 'Hari ini, 09:15',
        source: 'Input manual',
        type: 'in',
    },
    {
        title: 'Stock Keluar',
        product: 'Aqua 600 ml',
        quantity: '-24 pcs',
        date: 'Hari ini, 11:40',
        source: 'Penjualan toko',
        type: 'out',
    },
    {
        title: 'Pembelian Supplier',
        product: 'Minyak Goreng Tropical',
        quantity: '+30 pcs',
        date: 'Kemarin, 14:20',
        source: 'Dibeli dari Lumintu Grosir KTT',
        type: 'supplier',
    },
    {
        title: 'Stock Keluar',
        product: 'Beras Ramos 5kg',
        quantity: '-5 pcs',
        date: 'Kemarin, 16:05',
        source: 'Penjualan toko',
        type: 'out',
    },
    {
        title: 'Pembelian Supplier',
        product: 'Telur Ayam',
        quantity: '+10 tray',
        date: '20 Jul, 08:30',
        source: 'Dibeli dari Rahayu Grosir',
        type: 'supplier',
    },
    {
        title: 'Stock Masuk',
        product: 'Gula Pasir 1kg',
        quantity: '+15 pcs',
        date: '19 Jul, 13:10',
        source: 'Input manual',
        type: 'in',
    },
];

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
const activeFilterButton =
    'h-[25px] rounded-[7px] bg-[linear-gradient(135deg,#ffbd00_0%,#ffc91d_100%)] px-2 text-[9px] font-medium text-[#121212] shadow-[0_4px_8px_rgba(253,185,0,0.18)]';

export default function TransactionHistory() {
    return (
        <>
            <Head title="Riwayat Transaksi" />

            <header
                className="relative h-[126px] overflow-hidden bg-cover bg-[position:65%_center] px-3.5 pt-3.5 text-white"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-[rgba(8,31,58,0.86)]" />
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
                    <h1 className="text-[22px] leading-6 font-bold tracking-[-0.5px]">
                        Riwayat Transaksi
                    </h1>
                    <p className="mt-0.5 text-[11px] leading-4 text-white/95">
                        Pantau semua aktivitas stok toko Anda
                    </p>
                </div>
            </header>

            <section className="relative z-10 -mt-[17px] rounded-t-[20px] bg-[#fff9e8] pt-3">
                <div className="rounded-[18px] bg-white px-3.5 pt-2.5 pb-2 shadow-[0_6px_18px_rgba(253,185,0,0.08)]">
                    <label className="flex h-8 items-center gap-3 rounded-[8px] border border-[#dedede] px-3 text-[#999999]">
                        <Search
                            aria-hidden="true"
                            className="size-[17px] shrink-0"
                            strokeWidth={2}
                        />
                        <span className="sr-only">
                            Cari produk atau supplier
                        </span>
                        <input
                            type="search"
                            readOnly
                            placeholder="Cari produk atau supplier"
                            className="h-full min-w-0 flex-1 bg-transparent text-[10px] text-[#252525] outline-none placeholder:text-[#999999]"
                        />
                    </label>

                    <div className="mt-[7px] grid grid-cols-[58px_88px_88px_1fr] gap-2">
                        <button
                            type="button"
                            aria-pressed="true"
                            className={activeFilterButton}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            aria-pressed="false"
                            className={filterButton}
                        >
                            Stock Masuk
                        </button>
                        <button
                            type="button"
                            aria-pressed="false"
                            className={filterButton}
                        >
                            Stock Keluar
                        </button>
                        <button
                            type="button"
                            aria-pressed="false"
                            className={filterButton}
                        >
                            Pembelian Supplier
                        </button>
                    </div>
                    <div className="mt-[7px] grid grid-cols-[60px_76px_68px_1fr] gap-2">
                        <button
                            type="button"
                            aria-pressed="true"
                            className={activeFilterButton}
                        >
                            Hari Ini
                        </button>
                        <button
                            type="button"
                            aria-pressed="false"
                            className={filterButton}
                        >
                            Minggu Ini
                        </button>
                        <button
                            type="button"
                            aria-pressed="false"
                            className={filterButton}
                        >
                            Bulan Ini
                        </button>
                        <button
                            type="button"
                            className={`${filterButton} ml-auto flex w-[101px] items-center justify-center gap-2`}
                        >
                            <ArrowUpDown
                                aria-hidden="true"
                                className="size-[15px]"
                            />
                            <span>Terbaru</span>
                            <ChevronDown
                                aria-hidden="true"
                                className="size-3.5"
                            />
                        </button>
                    </div>
                </div>

                <div className="mx-2.5 mt-2 grid h-[59px] grid-cols-3 rounded-[15px] bg-white px-3 shadow-[0_5px_14px_rgba(14,34,62,0.04)]">
                    <SummaryItem
                        icon={ClipboardList}
                        iconClass="bg-[#fff1cf] text-[#ffa600]"
                        label="Total Transaksi"
                        value="128"
                        valueClass="text-[#0e223e]"
                    />
                    <SummaryItem
                        icon={ArrowDown}
                        iconClass="bg-[#dcf5ed] text-[#009f80]"
                        label="Stock Masuk"
                        value="64"
                        valueClass="text-[#009f80]"
                        bordered
                    />
                    <SummaryItem
                        icon={ArrowUp}
                        iconClass="bg-[#ffe0e0] text-[#df0808]"
                        label="Stock Keluar"
                        value="64"
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
                            <p className="mt-1 flex items-center gap-1.5 text-[9px] font-medium text-[#ff9900]">
                                <SlidersHorizontal
                                    aria-hidden="true"
                                    className="size-3.5"
                                />
                                Filter Aktif
                            </p>
                        </div>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 pt-0.5 text-[9px] font-medium text-[#ff9900]"
                        >
                            <RefreshCcw
                                aria-hidden="true"
                                className="size-3.5"
                            />
                            Reset Filter
                        </button>
                    </div>

                    <div className="mt-1 space-y-1">
                        {transactions.map((transaction) => (
                            <TransactionRow
                                key={`${transaction.product}-${transaction.date}`}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
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

function TransactionRow({ transaction }: { transaction: Transaction }) {
    const style = transactionStyles[transaction.type];
    const Icon = style.icon;

    return (
        <button
            type="button"
            className="grid h-[54px] w-full grid-cols-[36px_minmax(0,1fr)_52px_49px_12px] items-center gap-2 rounded-[12px] bg-white px-2.5 text-left shadow-[0_4px_11px_rgba(14,34,62,0.04)]"
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
                    {transaction.product}
                </span>
                <span className="block truncate text-[8px] leading-3 text-[#858585]">
                    {transaction.date}
                    <span className="px-1.5">•</span>
                    {transaction.source}
                </span>
            </span>
            <span
                className={`text-[9px] font-bold whitespace-nowrap ${style.amountClass}`}
            >
                {transaction.quantity}
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
