import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Box,
    Plus,
    ShoppingCart,
    SlidersHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import { dashboard } from '@/routes';
import { checkout, index as pos } from '@/routes/pos';
import { store as addCartItem } from '@/routes/pos/cart';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import posReference from '../../../../Design/POS/stock-out.png';

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    image_url: string | null;
};

type StockFilter = 'all' | 'available' | 'low' | 'out';

type PageProps = {
    products: Product[];
    filters: { search: string; stock: StockFilter };
    available_product_count: number;
    cart: { item_count: number };
};

const artwork: Record<string, { imageClass: string; imagePosition: string }> = {
    'Indomie Goreng': {
        imageClass: 'left-[38px] top-[17px] h-[71px] w-[96px]',
        imagePosition: '-57px -280px',
    },
    'Aqua 600 ml': {
        imageClass: 'left-[69px] top-[11px] h-[81px] w-[27px]',
        imagePosition: '-269px -274px',
    },
    'Minyak Goreng 1L': {
        imageClass: 'left-[53px] top-[8px] h-[81px] w-[63px]',
        imagePosition: '-72px -433px',
    },
    'Beras Ramos 5kg': {
        imageClass: 'left-[47px] top-[8px] h-[81px] w-[72px]',
        imagePosition: '-247px -433px',
    },
    'Gula Pasir 1kg': {
        imageClass: 'left-[50px] top-[8px] h-[74px] w-[71px]',
        imagePosition: '-69px -595px',
    },
    'Teh Pucuk 350ml': {
        imageClass: 'left-[72px] top-0 h-[85px] w-[24px]',
        imagePosition: '-272px -587px',
    },
};

const filterOrder: StockFilter[] = ['all', 'available', 'low', 'out'];

export default function PickProduct({
    products,
    filters,
    available_product_count,
    cart,
}: PageProps) {
    const [search, setSearch] = useState(filters.search);

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                pos().url,
                { search, stock: filters.stock },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters.search, filters.stock, search]);

    const cycleFilter = () => {
        const next =
            filterOrder[
                (filterOrder.indexOf(filters.stock) + 1) % filterOrder.length
            ];
        router.get(
            pos().url,
            { search, stock: next },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <>
            <Head title="POS Kasir" />

            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[170px] rounded-b-[29px] bg-[position:64%_center] px-[18px] pt-[13px] text-white"
            >
                <div className="relative flex items-center justify-between">
                    <Link
                        href={dashboard().url}
                        aria-label="Kembali ke dashboard"
                        className="flex size-9 items-center justify-center rounded-[13px] border border-white/25 bg-white/5 text-white backdrop-blur-[2px]"
                    >
                        <ArrowLeft
                            aria-hidden="true"
                            className="size-[21px]"
                            strokeWidth={2.1}
                        />
                    </Link>
                    <button
                        type="button"
                        aria-label="Buka notifikasi"
                        className="relative flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-[2px]"
                    >
                        <Bell
                            aria-hidden="true"
                            className="size-5 fill-white text-white"
                            strokeWidth={1.7}
                        />
                        <span className="absolute top-[7px] right-[7px] size-[7px] rounded-full bg-[#ed1717] ring-1 ring-[#68778a]" />
                    </button>
                </div>

                <AppPageHeaderHeading
                    title="POS Kasir"
                    description="Pilih produk untuk checkout barang"
                    className="relative mt-[8px]"
                    titleClassName="text-[26px] leading-[28px] font-bold tracking-[-0.45px]"
                    descriptionClassName="mt-0.5 text-[12px] leading-4 text-white/95"
                />

                <AppPageHeaderSearch
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Cari produk"
                    placeholder="Cari produk"
                    wrapperClassName="relative mt-[12px] flex h-[43px] items-center rounded-[16px] bg-white px-4 text-[#333] shadow-[0_3px_12px_rgba(2,20,43,0.05)]"
                    iconClassName="size-[21px] shrink-0"
                    inputClassName="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#858585]"
                    trailing={
                        <button
                            type="button"
                            onClick={cycleFilter}
                            aria-label={`Filter stok: ${filters.stock}`}
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
            </AppPageHeader>

            <section
                aria-label="Ringkasan POS"
                className="mx-4 mt-[17px] grid h-[53px] grid-cols-2 rounded-[13px] bg-white px-4 shadow-[0_5px_16px_rgba(14,34,62,0.04)]"
            >
                <PosSummary
                    icon={Box}
                    value={available_product_count.toString()}
                    label="Produk Tersedia"
                    iconClass="bg-[#fff0cd] text-[#ff9300]"
                />
                <PosSummary
                    icon={ShoppingCart}
                    value={cart.item_count.toString()}
                    label="Item di Keranjang"
                    iconClass="bg-[#fff0cd] text-[#ff9300]"
                    bordered
                />
            </section>

            <section
                aria-label="Daftar produk POS"
                className="mx-[19px] mt-[7px] -mb-4 grid grid-cols-2 gap-[7px]"
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                {products.length === 0 ? (
                    <p className="col-span-2 py-10 text-center text-[11px] text-[#666]">
                        Produk tidak ditemukan.
                    </p>
                ) : null}
            </section>

            <Link
                href={checkout().url}
                aria-label={`Buka keranjang, ${cart.item_count} item`}
                className="fixed bottom-[63px] left-[calc(50%+151px)] z-40 flex size-[54px] -translate-x-1/2 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[#0e223e] shadow-[0_7px_16px_rgba(253,185,0,0.28)]"
            >
                <ShoppingCart
                    aria-hidden="true"
                    className="size-[25px] fill-[#0e223e]"
                    strokeWidth={1.7}
                />
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#e9002b] text-[10px] font-bold text-white">
                    {cart.item_count}
                </span>
            </Link>
        </>
    );
}

function PosSummary({
    icon: Icon,
    value,
    label,
    iconClass,
    bordered = false,
}: {
    icon: LucideIcon;
    value: string;
    label: string;
    iconClass: string;
    bordered?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-[10px] ${bordered ? 'border-l border-[#e5e5e5] pl-4' : ''}`}
        >
            <span
                className={`flex size-[32px] shrink-0 items-center justify-center rounded-full ${iconClass}`}
            >
                <Icon
                    aria-hidden="true"
                    className="size-[17px]"
                    strokeWidth={2}
                />
            </span>
            <span>
                <span className="block text-[16px] leading-5 font-bold text-[#0e223e]">
                    {value}
                </span>
                <span className="block text-[9px] leading-3 whitespace-nowrap text-[#606060]">
                    {label}
                </span>
            </span>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const sprite = artwork[product.name];

    return (
        <article className="relative h-[155px] overflow-hidden rounded-[11px] bg-white px-[10px] shadow-[0_4px_12px_rgba(14,34,62,0.045)]">
            {product.image_url ? (
                <img
                    src={product.image_url}
                    alt=""
                    className="absolute top-2 left-1/2 h-[88px] w-[112px] -translate-x-1/2 object-contain"
                />
            ) : sprite ? (
                <span
                    aria-hidden="true"
                    className={`absolute bg-no-repeat ${sprite.imageClass}`}
                    style={{
                        backgroundImage: `url(${posReference})`,
                        backgroundPosition: sprite.imagePosition,
                        backgroundSize: '393px auto',
                    }}
                />
            ) : (
                <span
                    aria-hidden="true"
                    className="absolute top-3 left-1/2 flex size-[76px] -translate-x-1/2 items-center justify-center rounded-full bg-[#fff4d8] text-[#ff9300]"
                >
                    <Box className="size-8" />
                </span>
            )}

            <div className="absolute right-[10px] bottom-[7px] left-[10px]">
                <h2 className="truncate text-[11px] leading-4 font-semibold">
                    {product.name}
                </h2>
                <p className="text-[12px] leading-4 font-medium text-[#f48700]">
                    {formatCurrency(product.price)}
                </p>
                <p className="text-[9px] leading-4 text-[#5f5f5f]">
                    Stok: {product.stock} pcs
                </p>
            </div>

            <button
                type="button"
                disabled={product.stock === 0}
                onClick={() =>
                    router.post(
                        addCartItem().url,
                        { product_id: product.id, quantity: 1 },
                        { preserveScroll: true },
                    )
                }
                aria-label={`Tambahkan ${product.name} ke keranjang`}
                className="absolute right-[12px] bottom-[9px] flex size-[24px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Plus
                    aria-hidden="true"
                    className="size-[17px]"
                    strokeWidth={2.4}
                />
            </button>
        </article>
    );
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}
