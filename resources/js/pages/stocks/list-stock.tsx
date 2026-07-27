import { Head } from '@inertiajs/react';
import {
    Box,
    CircleAlert,
    ClipboardList,
    Layers3,
    ListFilter,
} from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import stockReference from '../../../../Design/Stock/list-stock.png';

type Product = {
    name: string;
    price: string;
    stock: string;
    imageClass: string;
    imagePosition: string;
};

const products: Product[] = [
    {
        name: 'Kopi Kapal Api 200g',
        price: 'Rp 12.000',
        stock: 'Stock: 24 pcs',
        imageClass: 'left-[52px] top-[6px] h-[76px] w-[63px]',
        imagePosition: '-68px -251px',
    },
    {
        name: 'Indomie Goreng',
        price: 'Rp 2.500',
        stock: 'Stock: 85 pcs',
        imageClass: 'left-[46px] top-[10px] h-[65px] w-[84px]',
        imagePosition: '-244px -255px',
    },
    {
        name: 'Aqua 600ml',
        price: 'Rp 3.000',
        stock: 'Stock: 40 botol',
        imageClass: 'left-[68px] top-[10px] h-[78px] w-[30px]',
        imagePosition: '-84px -396px',
    },
    {
        name: 'Beras Premium 5kg',
        price: 'Rp 62.000',
        stock: 'Stock: 12 karung',
        imageClass: 'left-[54px] top-[11px] h-[77px] w-[57px]',
        imagePosition: '-252px -397px',
    },
    {
        name: 'Minyak Goreng 1L',
        price: 'Rp 16.000',
        stock: 'Stock: 18 pcs',
        imageClass: 'left-[57px] top-[9px] h-[76px] w-[48px]',
        imagePosition: '-73px -536px',
    },
    {
        name: 'Teh Pucuk 350ml',
        price: 'Rp 3.500',
        stock: 'Stock: 30 botol',
        imageClass: 'left-[69px] top-[10px] h-[69px] w-[37px]',
        imagePosition: '-267px -537px',
    },
];

const categories = ['Semua', 'Makanan', 'Minuman', 'Kebutuhan Harian'];

export default function ListStock() {
    return (
        <>
            <Head title="Persediaan" />

            <div className="px-4 pt-[10px]">
                <AppPageHeader>
                    <AppPageHeaderHeading
                        title="Persediaan"
                        description="Lihat semua produk yang tersedia di toko"
                        titleClassName="text-[20px] leading-6 font-bold tracking-[-0.35px]"
                        descriptionClassName="mt-0.5 text-[10px] leading-4 text-[#646464]"
                    />
                </AppPageHeader>

                <div className="mt-[5px] flex gap-2">
                    <AppPageHeaderSearch
                        readOnly
                        aria-label="Cari produk"
                        placeholder="Cari produk"
                        wrapperClassName="flex h-[33px] min-w-0 flex-1 items-center rounded-[11px] bg-white px-3 shadow-[0_3px_10px_rgba(14,34,62,0.05)]"
                        iconClassName="size-[15px] shrink-0 text-[#858585]"
                        inputClassName="min-w-0 flex-1 bg-transparent px-3 text-[12px] outline-none placeholder:text-[#858585]"
                    />
                    <button
                        type="button"
                        aria-label="Filter produk"
                        className="flex size-[33px] shrink-0 items-center justify-center rounded-[9px] bg-white text-[#474747] shadow-[0_3px_10px_rgba(14,34,62,0.06)]"
                    >
                        <ListFilter
                            aria-hidden="true"
                            className="size-[16px]"
                            strokeWidth={1.8}
                        />
                    </button>
                </div>

                <div className="mt-[12px] grid h-[24px] grid-cols-[57px_63px_63px_95px] gap-[7px]">
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            type="button"
                            aria-pressed={index === 0}
                            className={`rounded-full text-[9px] font-medium whitespace-nowrap ${index === 0 ? 'border border-[#ffb000] text-[#f5a000]' : 'border border-[#e2e2e2] bg-white text-[#353535]'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <section
                    aria-label="Ringkasan persediaan"
                    className="mt-[7px] grid h-[73px] w-[355px] grid-cols-3 rounded-[10px] bg-white shadow-[0_5px_16px_rgba(14,34,62,0.05)]"
                >
                    <StockSummary
                        icon={Box}
                        label="Total Produk"
                        value="6"
                        color="text-[#ff9800]"
                    />
                    <StockSummary
                        icon={Layers3}
                        label="Total Stock"
                        value="209"
                        color="text-[#09a992]"
                        bordered
                    />
                    <StockSummary
                        icon={CircleAlert}
                        label="Stok Menipis"
                        value="1"
                        color="text-[#ef3526]"
                        bordered
                    />
                </section>

                <h2 className="mt-[11px] text-[15px] leading-5 font-bold tracking-[-0.2px]">
                    Daftar Produk
                </h2>

                <section
                    aria-label="Daftar produk"
                    className="mt-[7px] grid w-[356px] grid-cols-2 gap-x-[8px] gap-y-[10px]"
                >
                    {products.map((product) => (
                        <ProductCard key={product.name} product={product} />
                    ))}
                </section>
            </div>
        </>
    );
}

function StockSummary({
    icon: Icon,
    label,
    value,
    color,
    bordered = false,
}: {
    icon: typeof Box;
    label: string;
    value: string;
    color: string;
    bordered?: boolean;
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center ${bordered ? 'border-l border-[#e5e5e5]' : ''}`}
        >
            <Icon
                aria-hidden="true"
                className={`size-[17px] ${color}`}
                strokeWidth={1.8}
            />
            <span className="mt-1 text-[9px] leading-3 text-[#6f6f6f]">
                {label}
            </span>
            <span className={`text-[17px] leading-5 font-medium ${color}`}>
                {value}
            </span>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <article className="relative h-[132px] overflow-hidden rounded-[10px] bg-white px-[10px] shadow-[0_4px_12px_rgba(14,34,62,0.045)]">
            <span
                aria-hidden="true"
                className={`absolute bg-no-repeat ${product.imageClass}`}
                style={{
                    backgroundImage: `url(${stockReference})`,
                    backgroundPosition: product.imagePosition,
                    backgroundSize: '393px auto',
                }}
            />

            <div className="absolute right-[10px] bottom-[2px] left-[10px]">
                <h3 className="truncate text-[10px] leading-4 font-semibold">
                    {product.name}
                </h3>
                <p className="text-[11px] leading-4 font-medium text-[#ff9800]">
                    {product.price}
                </p>
                <p className="text-[9px] leading-4 text-[#777]">
                    {product.stock}
                </p>
            </div>

            <button
                type="button"
                aria-label={`Lihat detail ${product.name}`}
                className="absolute right-[11px] bottom-[5px] flex size-[23px] items-center justify-center rounded-full bg-[#08aa92] text-white shadow-[0_3px_7px_rgba(0,159,128,0.22)]"
            >
                <ClipboardList
                    aria-hidden="true"
                    className="size-[14px]"
                    strokeWidth={2}
                />
            </button>
        </article>
    );
}
