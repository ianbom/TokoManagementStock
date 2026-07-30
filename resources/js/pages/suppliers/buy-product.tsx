import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Boxes,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    ShoppingBasket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import { buy, checkout, index as supplierList } from '@/routes/suppliers';
import {
    destroy as destroyCart,
    store as addCart,
    update as updateCart,
} from '@/routes/suppliers/cart';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import productReference from '../../../../Design/POS/stock-out.png';

type Supplier = {
    id: number;
    name: string;
    category: string | null;
    address: string;
};
type Product = {
    id: number;
    name: string;
    stock: number;
    price: number;
    image_url: string | null;
};
type CartItem = Product & { quantity: number; subtotal: number };
type Cart = {
    items: CartItem[];
    item_count: number;
    subtotal: number;
    total: number;
};
type Paginated<T> = {
    data: T[];
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
const fallbackImages = [
    ['left-[38px] top-[17px] h-[71px] w-[96px]', '-57px -280px'],
    ['left-[69px] top-[11px] h-[81px] w-[27px]', '-269px -274px'],
    ['left-[53px] top-[8px] h-[81px] w-[63px]', '-72px -433px'],
    ['left-[50px] top-[8px] h-[74px] w-[71px]', '-69px -595px'],
] as const;

export default function BuyProduct({
    supplier,
    products,
    cart,
    filters,
}: {
    supplier: Supplier;
    products: Paginated<Product>;
    cart: Cart;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                buy(supplier.id).url,
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['products', 'filters'],
                },
            );
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters.search, search, supplier.id]);

    const quantityFor = (productId: number) =>
        cart.items.find((item) => item.id === productId)?.quantity ?? 0;

    return (
        <>
            <Head title="Belanja Supplier" />
            <style>{'html { scrollbar-gutter: auto; }'}</style>

            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[129px] rounded-b-[31px] bg-[position:64%_center] px-[18px] pt-[13px] text-white"
            >
                <div className="relative flex items-center justify-between">
                    <Link
                        href={supplierList().url}
                        aria-label="Kembali ke daftar supplier"
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
                    </button>
                </div>
                <AppPageHeaderHeading
                    title="Belanja Supplier"
                    description={supplier.name}
                    className="relative mt-[8px]"
                    titleClassName="text-[26px] leading-[28px] font-bold tracking-[-0.45px]"
                    descriptionClassName="mt-0.5 text-[12px] leading-4 text-white/95"
                />
            </AppPageHeader>

            <section className="relative z-10 mx-4 -mt-[20px] rounded-[18px] bg-white px-3 py-3 shadow-[0_6px_18px_rgba(253,185,0,0.07)]">
                <AppPageHeaderSearch
                    aria-label="Cari produk supplier"
                    placeholder="Cari produk grosir"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    wrapperClassName="flex h-[32px] min-w-0 items-center rounded-[10px] bg-[#fbfbfb] px-3 text-[#555]"
                    iconClassName="size-[17px] shrink-0 text-[#777]"
                    inputClassName="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#858585]"
                />
            </section>

            <section className="mx-4 grid h-[53px] grid-cols-2 rounded-[13px] bg-white px-4 shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <OrderSummary
                    icon={Boxes}
                    value={String(products.total)}
                    label="Produk Grosir"
                />
                <OrderSummary
                    icon={ShoppingBasket}
                    value={String(cart.item_count)}
                    label="Item Pesanan"
                    bordered
                />
            </section>

            <section
                aria-label="Produk supplier"
                className="mx-[19px] mt-[7px] grid grid-cols-2 gap-[7px]"
            >
                {products.data.length ? (
                    products.data.map((product, index) => (
                        <SupplierProductCard
                            key={product.id}
                            supplier={supplier}
                            product={product}
                            quantity={quantityFor(product.id)}
                            fallback={
                                fallbackImages[index % fallbackImages.length]
                            }
                        />
                    ))
                ) : (
                    <p className="col-span-2 rounded-[11px] bg-white px-4 py-8 text-center text-[11px] text-[#858585]">
                        Produk supplier tidak ditemukan.
                    </p>
                )}
            </section>

            <Pagination
                previous={products.prev_page_url}
                next={products.next_page_url}
            />

            {cart.item_count > 0 ? (
                <Link
                    href={checkout(supplier.id).url}
                    aria-label={`Buka keranjang, ${cart.item_count} item`}
                    className="fixed bottom-[63px] left-[calc(50%+151px)] z-40 flex size-[54px] -translate-x-1/2 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[#0e223e] shadow-[0_7px_16px_rgba(253,185,0,0.28)]"
                >
                    <ShoppingBasket
                        aria-hidden="true"
                        className="size-[25px] fill-[#0e223e]"
                        strokeWidth={1.7}
                    />
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#e9002b] text-[10px] font-bold text-white">
                        {cart.item_count}
                    </span>
                </Link>
            ) : null}
        </>
    );
}

function OrderSummary({
    icon: Icon,
    value,
    label,
    bordered = false,
}: {
    icon: LucideIcon;
    value: string;
    label: string;
    bordered?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-[10px] ${bordered ? 'border-l border-[#e5e5e5] pl-4' : ''}`}
        >
            <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#fff0cd] text-[#ff9300]">
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

function SupplierProductCard({
    supplier,
    product,
    quantity,
    fallback,
}: {
    supplier: Supplier;
    product: Product;
    quantity: number;
    fallback: (typeof fallbackImages)[number];
}) {
    const changeQuantity = (nextQuantity: number) => {
        if (nextQuantity < 1) {
            router.delete(destroyCart([supplier.id, product.id]).url, {
                preserveScroll: true,
                only: ['cart'],
            });

            return;
        }

        router.patch(
            updateCart([supplier.id, product.id]).url,
            { quantity: nextQuantity },
            { preserveScroll: true, only: ['cart'] },
        );
    };

    const add = () => {
        if (quantity === 0) {
            router.post(
                addCart(supplier.id).url,
                { product_id: product.id, quantity: 1 },
                { preserveScroll: true, only: ['cart'] },
            );

            return;
        }

        changeQuantity(quantity + 1);
    };

    return (
        <article className="relative h-[155px] overflow-hidden rounded-[11px] bg-white px-[10px] shadow-[0_4px_12px_rgba(14,34,62,0.045)]">
            {product.image_url ? (
                <img
                    src={product.image_url}
                    alt=""
                    className="absolute top-2 left-1/2 h-[82px] w-[105px] -translate-x-1/2 object-contain"
                />
            ) : (
                <span
                    aria-hidden="true"
                    className={`absolute bg-no-repeat ${fallback[0]}`}
                    style={{
                        backgroundImage: `url(${productReference})`,
                        backgroundPosition: fallback[1],
                        backgroundSize: '393px auto',
                    }}
                />
            )}
            <div className="absolute right-[10px] bottom-[7px] left-[10px]">
                <h2 className="truncate text-[11px] leading-4 font-semibold">
                    {product.name}
                </h2>
                <p className="text-[12px] leading-4 font-medium text-[#f48700]">
                    {currency.format(product.price)}
                </p>
                <p className="truncate text-[8px] leading-3 text-[#5f5f5f]">
                    Stok: {product.stock} pcs
                </p>
                <div className="mt-1 flex items-center justify-end gap-1">
                    {quantity > 0 && (
                        <button
                            type="button"
                            onClick={() => changeQuantity(quantity - 1)}
                            aria-label={`Kurangi ${product.name}`}
                            className="flex size-[19px] items-center justify-center rounded-[5px] border border-[#ffb500] text-[#f29a00]"
                        >
                            <Minus className="size-3" />
                        </button>
                    )}
                    {quantity > 0 && (
                        <span className="min-w-5 text-center text-[10px] font-semibold">
                            {quantity}
                        </span>
                    )}
                    <button
                        disabled={quantity >= product.stock}
                        type="button"
                        onClick={add}
                        aria-label={`Tambah ${product.name}`}
                        className="flex size-[19px] items-center justify-center rounded-[5px] bg-[#ffb500] text-white disabled:opacity-40"
                    >
                        <Plus className="size-3" />
                    </button>
                </div>
            </div>
        </article>
    );
}

function Pagination({
    previous,
    next,
}: {
    previous: string | null;
    next: string | null;
}) {
    if (!previous && !next) {
        return null;
    }

    return (
        <div className="mx-[19px] mt-3 flex justify-end gap-2 pb-20">
            {previous && (
                <Link
                    href={previous}
                    preserveScroll
                    className="flex size-8 items-center justify-center rounded-full bg-white text-[#f2a000]"
                >
                    <ChevronLeft className="size-4" />
                </Link>
            )}
            {next && (
                <Link
                    href={next}
                    preserveScroll
                    className="flex size-8 items-center justify-center rounded-full bg-[#ffb500] text-white"
                >
                    <ChevronRight className="size-4" />
                </Link>
            )}
        </div>
    );
}
