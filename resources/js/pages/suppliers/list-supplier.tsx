import { Head, Link } from '@inertiajs/react';
import {
    Bell,
    ChevronRight,
    MapPin,
    PackageSearch,
    SlidersHorizontal,
} from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import { buy } from '@/routes/suppliers';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import supplierReference from '../../../../Design/Obrolan/Obrolan.png';

type Supplier = {
    slug: string;
    name: string;
    category: string;
    address: string;
    distance: string;
    avatarPosition: string;
};

const suppliers: Supplier[] = [
    {
        slug: 'lumintu-grosir-ktt',
        name: 'Lumintu Grosir KTT',
        category: 'Grosir Sembako',
        address: 'Jl. Ketintang Baru Selatan No. 7',
        distance: '1 km',
        avatarPosition: '-38px -229px',
    },
    {
        slug: 'rahayu-grosir',
        name: 'Rahayu Grosir',
        category: 'Kebutuhan Harian',
        address: 'Jl. Ketintang Madya No. 17',
        distance: '1,8 km',
        avatarPosition: '-38px -296px',
    },
    {
        slug: 'kevin-frozen-food',
        name: 'Kevin Frozen Food',
        category: 'Frozen Food',
        address: 'Jl. Karah No. 19',
        distance: '2,1 km',
        avatarPosition: '-38px -360px',
    },
    {
        slug: 'sumber-makmur',
        name: 'Sumber Makmur',
        category: 'Grosir Minuman',
        address: 'Jl. Gayungan PTT No. 12',
        distance: '2,7 km',
        avatarPosition: '-38px -425px',
    },
    {
        slug: 'mitra-sembako-surabaya',
        name: 'Mitra Sembako Surabaya',
        category: 'Distributor Sembako',
        address: 'Jl. Ahmad Yani No. 88',
        distance: '3,2 km',
        avatarPosition: '-38px -493px',
    },
];

export default function ListSupplier() {
    return (
        <>
            <Head title="Supplier" />
            <style>{'html { scrollbar-gutter: auto; }'}</style>

            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[170px] rounded-b-[29px] bg-[position:65%_center] px-[25px] pt-[47px] text-white"
            >
                <button
                    type="button"
                    aria-label="Buka notifikasi"
                    className="absolute top-[27px] right-[27px] z-10 flex size-[39px] items-center justify-center rounded-full bg-white/20 backdrop-blur-[2px]"
                >
                    <Bell
                        aria-hidden="true"
                        className="size-[21px] fill-white text-white"
                        strokeWidth={1.7}
                    />
                    <span className="absolute top-[8px] right-[8px] size-[7px] rounded-full bg-[#ed1717] ring-1 ring-[#68778a]" />
                </button>

                <div className="relative">
                    <AppPageHeaderHeading
                        title="Supplier"
                        description="Temukan supplier terbaik untuk tokomu"
                        titleClassName="text-[26px] leading-[27px] font-bold tracking-[-0.5px]"
                        descriptionClassName="mt-0.5 text-[15px] leading-5 text-white/95"
                    />

                    <AppPageHeaderSearch
                        readOnly
                        aria-label="Cari nama atau kategori supplier"
                        placeholder="Cari nama atau kategori supplier"
                        wrapperClassName="mt-[12px] flex h-[43px] items-center rounded-[16px] bg-white px-4 text-[#333] shadow-[0_3px_12px_rgba(2,20,43,0.05)]"
                        iconClassName="size-[21px] shrink-0"
                        inputClassName="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#858585]"
                        trailing={
                            <button
                                type="button"
                                aria-label="Filter supplier"
                                className="flex size-8 items-center justify-center"
                            >
                                <SlidersHorizontal
                                    aria-hidden="true"
                                    className="size-[19px]"
                                    strokeWidth={1.9}
                                />
                            </button>
                        }
                    />
                </div>
            </AppPageHeader>

            <section className="px-[25px] pt-[17px]">
                <div className="flex h-[20px] items-center justify-between px-0.5">
                    <h2 className="text-[16px] leading-5 font-bold tracking-[-0.2px] text-[#252525]">
                        Daftar Supplier
                    </h2>
                    <span className="rounded-full bg-[#fff0cd] px-2.5 py-1 text-[10px] font-semibold text-[#f29a00]">
                        5 Supplier
                    </span>
                </div>

                <div className="mt-[11px] space-y-[8px]">
                    {suppliers.map((supplier) => (
                        <SupplierCard key={supplier.name} supplier={supplier} />
                    ))}
                </div>
            </section>
        </>
    );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
    const href = buy({ query: { supplier: supplier.slug } }).url;

    return (
        <article className="grid h-[86px] grid-cols-[50px_minmax(0,1fr)_31px] items-center gap-[12px] rounded-[14px] bg-white px-[13px] shadow-[0_6px_18px_rgba(14,34,62,0.035)]">
            <span
                aria-hidden="true"
                className="size-[50px] rounded-full bg-no-repeat"
                style={{
                    backgroundImage: `url(${supplierReference})`,
                    backgroundPosition: supplier.avatarPosition,
                    backgroundSize: '393px auto',
                }}
            />

            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="truncate text-[13px] leading-[18px] font-bold tracking-[-0.15px] text-[#252525]">
                        {supplier.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#edf9f2] px-[6px] py-0.5 text-[8px] font-semibold text-[#35a86b]">
                        Tersedia
                    </span>
                </div>
                <p className="mt-0.5 text-[10px] leading-4 font-medium text-[#f2a000]">
                    {supplier.category}
                </p>
                <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[9px] leading-3 text-[#858585]">
                    <MapPin
                        aria-hidden="true"
                        className="size-[11px] shrink-0"
                        strokeWidth={1.9}
                    />
                    <span className="truncate">{supplier.address}</span>
                    <span className="shrink-0">• {supplier.distance}</span>
                </p>
                <Link
                    href={href}
                    className="mt-1 flex items-center gap-1 text-[9px] leading-3 font-semibold text-[#f2a000]"
                >
                    <PackageSearch
                        aria-hidden="true"
                        className="size-[12px]"
                        strokeWidth={2}
                    />
                    Lihat Produk
                </Link>
            </div>

            <Link
                href={href}
                aria-label={`Buka ${supplier.name}`}
                className="flex size-[30px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white"
            >
                <ChevronRight
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={2.8}
                />
            </Link>
        </article>
    );
}
