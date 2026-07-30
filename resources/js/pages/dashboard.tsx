import { Head, Link } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    UserRound,
} from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import { index as pos } from '@/routes/pos';
import { index as stockList, input } from '@/routes/stocks';
import { buy, index as supplierList } from '@/routes/suppliers';
import { history as transactionHistory } from '@/routes/transactions';
import type { Auth } from '@/types';
import heroImage from '../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import scanOutIcon from '../../../Design/Dashboard/Group 1 (1).png';
import supplierPhoto from '../../../Design/Dashboard/Group 1 (2).png';
import scanInIcon from '../../../Design/Dashboard/Group 1.png';
import inventoryIcon from '../../../Design/Dashboard/Group 3 (1).png';
import bestSellerIcon from '../../../Design/Dashboard/Group 3 (2).png';
import supplierIcon from '../../../Design/Dashboard/Group 3.png';

type Business = { id: number; name: string; type: 'store' | 'supplier' } | null;
type FinancialSummary = {
    income: number;
    expense: number;
    gross_profit: number;
    period_label: string;
};
type BestSeller = {
    product_id: number;
    name: string;
    quantity_sold: number;
} | null;
type Supplier = {
    id: number;
    name: string;
    category: string;
    address: string;
    products_count: number;
};
type DashboardPageProps = {
    auth: Auth;
    business: Business;
    financial_summary: FinancialSummary;
    best_seller: BestSeller;
    suppliers: Supplier[];
};

const quickActions = [
    { label: 'Scan Barang\nMasuk', icon: scanInIcon, href: input().url },
    { label: 'Scan Barang\nKeluar', icon: scanOutIcon, href: pos().url },
    { label: 'Supplier', icon: supplierIcon, href: supplierList().url },
    { label: 'Persediaan', icon: inventoryIcon, href: stockList().url },
];

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export default function Dashboard({
    auth,
    business,
    financial_summary,
    best_seller,
    suppliers,
}: DashboardPageProps) {
    const businessName = business?.name ?? 'Bisnis Anda';

    return (
        <>
            <Head title="Dashboard" />
            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[294px] rounded-b-[36px] bg-[position:65%_center] px-5 pt-[50px] text-white"
            >
                <div className="relative flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#67c8ee] text-[#0e223e] ring-2 ring-white/10">
                            <UserRound
                                aria-hidden="true"
                                className="size-8"
                                strokeWidth={2.2}
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-[19px] leading-[1.25] font-bold tracking-[-0.2px]">
                                {auth.user.name}
                            </p>
                            <p className="mt-0.5 truncate text-[13px] leading-5 text-white/90">
                                {businessName}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label="Buka notifikasi"
                        className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white/22 transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none"
                    >
                        <Bell
                            aria-hidden="true"
                            className="size-6 fill-white text-white"
                            strokeWidth={1.8}
                        />
                    </button>
                </div>

                <AppPageHeaderHeading
                    className="relative mt-[42px]"
                    title={
                        <>
                            Halo, {businessName} {'\u{1F44B}'}
                        </>
                    }
                    description="Yuk cek dan lengkapi persediaan toko anda!"
                    titleClassName="truncate text-[26px] leading-[1.2] font-bold tracking-[-0.4px]"
                    descriptionClassName="mt-1 text-[15px] leading-6 text-white/90"
                />
            </AppPageHeader>

            <section className="relative z-10 mx-5 -mt-14 rounded-[20px] bg-[linear-gradient(135deg,#fdb900_0%,#ffc333_100%)] p-4 text-[#0e223e] shadow-[0_8px_20px_rgba(255,179,0,0.10)]">
                <div className="flex items-center justify-between">
                    <p className="text-[16px] leading-5 font-medium text-white">
                        LABA
                    </p>
                    <span className="h-7 rounded-[10px] bg-[#0e223e] px-3 text-[11px] leading-7 font-medium text-[#fdb900]">
                        {financial_summary.period_label}
                    </span>
                </div>
                <p className="mt-3 text-[28px] leading-[1.15] font-bold tracking-[-0.6px] tabular-nums">
                    {currency.format(financial_summary.gross_profit)}
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                    <FinancialItem
                        icon={ChevronUp}
                        label="Pemasukan"
                        value={financial_summary.income}
                    />
                    <FinancialItem
                        icon={ChevronDown}
                        label="Pengeluaran"
                        value={financial_summary.expense}
                        expense
                    />
                </div>
            </section>

            <section
                aria-label="Aksi cepat"
                className="mx-5 mt-10 grid grid-cols-2 gap-5 max-[359px]:gap-3"
            >
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="flex min-h-[140px] flex-col items-start rounded-[18px] bg-white p-4 text-left shadow-[0_4px_14px_rgba(14,34,62,0.04)] transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none"
                    >
                        <img
                            src={action.icon}
                            alt=""
                            className="size-[59px] object-contain"
                        />
                        <span className="mt-3 text-[16px] leading-[1.3] font-medium tracking-[-0.1px] whitespace-pre-line">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </section>

            <Link
                href={transactionHistory().url}
                className="mx-5 mt-5 flex min-h-[104px] w-[calc(100%-40px)] items-center gap-3.5 rounded-[18px] bg-white px-4 py-5 text-left shadow-[0_4px_14px_rgba(14,34,62,0.04)] transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none"
            >
                <img
                    src={bestSellerIcon}
                    alt=""
                    className="size-[59px] shrink-0 object-contain"
                />
                <span className="min-w-0">
                    <span className="block text-[16px] leading-[1.3] font-medium tracking-[-0.1px]">
                        Barang Terlaris
                    </span>
                    <span className="mt-1 block truncate text-[13px] leading-5 text-[#858585]">
                        {best_seller
                            ? `${best_seller.name} • ${best_seller.quantity_sold} terjual bulan ini`
                            : 'Belum ada penjualan bulan ini'}
                    </span>
                </span>
            </Link>

            <section className="mx-5 mt-10">
                <h2 className="mb-3 text-[18px] leading-6 font-semibold tracking-[-0.2px]">
                    Rekomendasi Supplier
                </h2>
                <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                    {suppliers.length ? (
                        suppliers.map((supplier, index) => (
                            <article
                                key={supplier.id}
                                className={`grid min-h-[105px] grid-cols-[58px_1fr] gap-4 p-4 ${index < suppliers.length - 1 ? 'border-b border-[#ececec]' : ''}`}
                            >
                                <img
                                    src={supplierPhoto}
                                    alt=""
                                    className="size-[56px] rounded-full object-cover"
                                />
                                <div className="min-w-0">
                                    <h3 className="truncate text-[15px] leading-[1.3] font-medium tracking-[-0.1px]">
                                        {supplier.name}
                                    </h3>
                                    <p className="mt-1 truncate text-[12px] leading-5 text-[#858585]">
                                        {supplier.address}
                                    </p>
                                    <Link
                                        href={buy(supplier.id).url}
                                        className="mt-2 ml-auto flex min-h-6 items-center justify-end gap-2 text-[11px] leading-4 font-medium text-[#ffb300]"
                                    >
                                        Cek {supplier.products_count} Barang
                                        Tersedia
                                        <ChevronRight
                                            aria-hidden="true"
                                            className="size-4"
                                            strokeWidth={1.8}
                                        />
                                    </Link>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="px-4 py-8 text-center text-[12px] text-[#858585]">
                            Belum ada supplier tersedia.
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}

function FinancialItem({
    icon: Icon,
    label,
    value,
    expense = false,
}: {
    icon: typeof ChevronUp;
    label: string;
    value: number;
    expense?: boolean;
}) {
    return (
        <div className="min-h-[75px] rounded-[12px] bg-[rgba(255,210,83,0.65)] p-3.5">
            <div className="flex items-center gap-1.5 text-white/90">
                <Icon aria-hidden="true" className="size-4" strokeWidth={2.2} />
                <span className="text-[12px] leading-4">{label}</span>
            </div>
            <p
                className={`mt-2 text-[14px] leading-5 font-bold whitespace-nowrap tabular-nums ${expense ? 'text-[#e30805]' : 'text-[#252525]'}`}
            >
                {currency.format(value)}
            </p>
        </div>
    );
}
