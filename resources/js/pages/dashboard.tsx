import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    UserRound,
} from 'lucide-react';
import { index as stockList, input } from '@/routes/stocks';
import type { Auth } from '@/types';
import heroImage from '../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import scanOutIcon from '../../../Design/Dashboard/Group 1 (1).png';
import supplierPhoto from '../../../Design/Dashboard/Group 1 (2).png';
import scanInIcon from '../../../Design/Dashboard/Group 1.png';
import inventoryIcon from '../../../Design/Dashboard/Group 3 (1).png';
import bestSellerIcon from '../../../Design/Dashboard/Group 3 (2).png';
import supplierIcon from '../../../Design/Dashboard/Group 3.png';

type DashboardPageProps = {
    auth: Auth;
};

const quickActions = [
    { label: 'Scan Barang\nMasuk', icon: scanInIcon, href: input().url },
    { label: 'Scan Barang\nKeluar', icon: scanOutIcon, href: null },
    { label: 'Supplier', icon: supplierIcon, href: null },
    { label: 'Persediaan', icon: inventoryIcon, href: stockList().url },
];

const suppliers = [
    {
        name: 'Lumintu Grosir KTT (1 Km)',
        address: 'Jl. Kelintang Baru Selatan No. 7',
    },
    {
        name: 'Rahayu Grosir (1.8 Km)',
        address: 'Jl. Kelintang Madya No. 17',
    },
    {
        name: 'Kevin Frozen Food (2.1 Km)',
        address: 'Jl. Karah No. 19',
    },
];

export default function Dashboard() {
    const { auth } = usePage<DashboardPageProps>().props;

    return (
        <>
            <Head title="Dashboard" />
            <header
                className="relative h-[294px] overflow-hidden rounded-b-[36px] bg-cover bg-[position:65%_center] px-5 pt-[50px] text-white"
                style={{
                    backgroundImage: 'url(' + heroImage + ')',
                }}
            >
                <div className="absolute inset-0 bg-[rgba(8,31,58,0.84)]" />

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
                                Toko Ketintang Mart
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
                        <span className="absolute top-[11px] right-[11px] size-[9px] rounded-full bg-[#ff1a1a] ring-2 ring-[#667487]" />
                    </button>
                </div>

                <div className="relative mt-[42px]">
                    <h1 className="text-[26px] leading-[1.2] font-bold tracking-[-0.4px]">
                        Halo, Ketintang Mart {'\u{1F44B}'}
                    </h1>
                    <p className="mt-1 text-[15px] leading-6 text-white/90">
                        Yuk cek dan lengkapi persediaan toko anda!
                    </p>
                </div>
            </header>

            <section className="relative z-10 mx-5 -mt-14 rounded-[20px] bg-[linear-gradient(135deg,#fdb900_0%,#ffc333_100%)] p-4 text-[#0e223e] shadow-[0_8px_20px_rgba(255,179,0,0.10)]">
                <div className="flex items-center justify-between">
                    <p className="text-[16px] leading-5 font-medium text-white">
                        LABA
                    </p>
                    <button
                        type="button"
                        className="h-7 rounded-[10px] bg-[#0e223e] px-3 text-[11px] leading-7 font-medium text-[#fdb900] transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none"
                    >
                        Bulan Ini
                    </button>
                </div>

                <p className="mt-3 text-[28px] leading-[1.15] font-bold tracking-[-0.6px]">
                    Rp 650.000,00
                </p>

                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                    <div className="min-h-[75px] rounded-[12px] bg-[rgba(255,210,83,0.65)] p-3.5">
                        <div className="flex items-center gap-1.5 text-white/90">
                            <ChevronUp
                                aria-hidden="true"
                                className="size-4"
                                strokeWidth={2.2}
                            />
                            <span className="text-[12px] leading-4">
                                Pemasukan
                            </span>
                        </div>
                        <p className="mt-2 text-[14px] leading-5 font-bold whitespace-nowrap text-[#252525]">
                            Rp 2.150.000,00
                        </p>
                    </div>

                    <div className="min-h-[75px] rounded-[12px] bg-[rgba(255,210,83,0.65)] p-3.5">
                        <div className="flex items-center gap-1.5 text-white/90">
                            <ChevronDown
                                aria-hidden="true"
                                className="size-4"
                                strokeWidth={2.2}
                            />
                            <span className="text-[12px] leading-4">
                                Pengeluaran
                            </span>
                        </div>
                        <p className="mt-2 text-[14px] leading-5 font-bold whitespace-nowrap text-[#e30805]">
                            Rp 1.500.000,00
                        </p>
                    </div>
                </div>
            </section>

            <section
                aria-label="Aksi cepat"
                className="mx-5 mt-10 grid grid-cols-2 gap-5 max-[359px]:gap-3"
            >
                {quickActions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={() => action.href && router.visit(action.href)}
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
                    </button>
                ))}
            </section>

            <button
                type="button"
                className="mx-5 mt-5 flex min-h-[104px] w-[calc(100%-40px)] items-center gap-3.5 rounded-[18px] bg-white px-4 py-5 text-left shadow-[0_4px_14px_rgba(14,34,62,0.04)] transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none"
            >
                <img
                    src={bestSellerIcon}
                    alt=""
                    className="size-[59px] shrink-0 object-contain"
                />
                <span>
                    <span className="block text-[16px] leading-[1.3] font-medium tracking-[-0.1px]">
                        Barang Terlaris
                    </span>
                    <span className="mt-1 block text-[13px] leading-5 text-[#858585]">
                        Lihat produk best-seller bulan ini
                    </span>
                </span>
            </button>

            <section className="mx-5 mt-10">
                <h2 className="mb-3 text-[18px] leading-6 font-semibold tracking-[-0.2px]">
                    Rekomendasi Supplier Terdekat
                </h2>

                <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                    {suppliers.map((supplier, index) => (
                        <article
                            key={supplier.name}
                            className={[
                                'grid min-h-[105px] grid-cols-[58px_1fr] gap-4 p-4',
                                index < suppliers.length - 1
                                    ? 'border-b border-[#ececec]'
                                    : '',
                            ].join(' ')}
                        >
                            <img
                                src={supplierPhoto}
                                alt=""
                                className="size-[56px] rounded-full object-cover"
                            />
                            <div className="min-w-0">
                                <h3 className="text-[15px] leading-[1.3] font-medium tracking-[-0.1px]">
                                    {supplier.name}
                                </h3>
                                <p className="mt-1 truncate text-[12px] leading-5 text-[#858585]">
                                    {supplier.address}
                                </p>
                                <button
                                    type="button"
                                    className="mt-2 ml-auto flex min-h-6 items-center gap-2 text-[11px] leading-4 font-medium text-[#ffb300]"
                                >
                                    Cek Barang Tersedia
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-4"
                                        strokeWidth={1.8}
                                    />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
