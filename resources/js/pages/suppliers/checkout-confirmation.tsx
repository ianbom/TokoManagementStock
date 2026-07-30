import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Bell, Minus, Plus, Store, Trash2 } from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import { buy } from '@/routes/suppliers';
import {
    destroy as destroyCart,
    update as updateCart,
} from '@/routes/suppliers/cart';
import { store as checkoutStore } from '@/routes/suppliers/checkout';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import productReference from '../../../../Design/POS/stock-out.png';

type Supplier = {
    id: number;
    name: string;
    category: string | null;
    address: string;
};
type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    stock: number;
    image_url: string | null;
};
type Cart = {
    items: CartItem[];
    item_count: number;
    subtotal: number;
    total: number;
};

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});
const fallbackPositions = [
    '-32px -157px',
    '-151px -153px',
    '-40px -242px',
    '-39px -333px',
];

export default function SupplierCheckoutConfirmation({
    supplier,
    cart,
}: {
    supplier: Supplier;
    cart: Cart;
}) {
    const { post, processing, errors } = useForm<{ cart?: string }>({});

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post(checkoutStore(supplier.id).url, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Konfirmasi Pesanan Supplier" />
            <style>{'html { scrollbar-gutter: auto; }'}</style>

            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[118px] rounded-b-[29px] bg-[position:64%_center] px-[17px] pt-[10px] text-white"
            >
                <div className="relative flex items-center justify-between">
                    <Link
                        href={buy(supplier.id).url}
                        aria-label="Kembali belanja"
                        className="flex size-[33px] items-center justify-center rounded-[13px] border border-white/25 bg-white/5 text-white"
                    >
                        <ArrowLeft
                            aria-hidden="true"
                            className="size-[21px]"
                            strokeWidth={2.2}
                        />
                    </Link>
                    <button
                        type="button"
                        aria-label="Buka notifikasi"
                        className="relative flex size-[33px] items-center justify-center rounded-full bg-white/20"
                    >
                        <Bell
                            aria-hidden="true"
                            className="size-[19px] fill-white text-white"
                            strokeWidth={1.7}
                        />
                    </button>
                </div>
                <AppPageHeaderHeading
                    title="Konfirmasi Pesanan"
                    description="Periksa produk sebelum membuat pesanan"
                    className="relative mt-[9px]"
                    titleClassName="text-[25px] leading-[29px] font-bold tracking-[-0.45px]"
                    descriptionClassName="mt-0.5 text-[11px] leading-4 text-white/95"
                />
            </AppPageHeader>

            <section className="relative z-10 mx-[13px] -mt-4 flex h-[53px] items-center gap-3 rounded-[13px] bg-white px-[13px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <span className="flex size-[34px] items-center justify-center rounded-full bg-[#fff0cd] text-[#f29a00]">
                    <Store
                        aria-hidden="true"
                        className="size-[18px]"
                        strokeWidth={2}
                    />
                </span>
                <span className="min-w-0">
                    <span className="block truncate text-[12px] leading-4 font-bold text-[#0e223e]">
                        {supplier.name}
                    </span>
                    <span className="block truncate text-[9px] leading-3 text-[#858585]">
                        {supplier.address}
                    </span>
                </span>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[11px] pt-[9px] pb-[7px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <div className="flex items-center justify-between">
                    <h2 className="text-[13px] leading-4 font-bold text-[#0e223e]">
                        Produk Pesanan
                    </h2>
                    <span className="text-[9px] text-[#858585]">
                        {cart.item_count} item
                    </span>
                </div>
                <div className="mt-[6px] space-y-[5px]">
                    {cart.items.map((product, index) => (
                        <OrderProductRow
                            key={product.id}
                            supplier={supplier}
                            product={product}
                            fallbackPosition={
                                fallbackPositions[
                                    index % fallbackPositions.length
                                ]
                            }
                        />
                    ))}
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[13px] py-[9px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <dl className="space-y-[5px] text-[9px] text-[#666]">
                    <PaymentRow
                        label="Jumlah Item"
                        value={`${cart.item_count} item`}
                    />
                    <PaymentRow
                        label="Subtotal"
                        value={currency.format(cart.subtotal)}
                    />
                    <PaymentRow
                        label="Biaya Layanan"
                        value={currency.format(0)}
                    />
                </dl>
                <div className="mt-[7px] flex items-center justify-between border-t border-[#e4e4e4] pt-[7px]">
                    <span className="text-[12px] font-bold text-[#0e223e]">
                        Total Pesanan
                    </span>
                    <strong className="text-[15px] text-[#f06c00]">
                        {currency.format(cart.total)}
                    </strong>
                </div>
            </section>

            {errors.cart && (
                <p className="mx-[13px] mt-2 rounded-[9px] bg-red-50 px-3 py-2 text-[10px] text-red-600">
                    {errors.cart}
                </p>
            )}

            <form
                onSubmit={submit}
                className="mx-[13px] mt-[8px] -mb-[50px] grid h-[50px] grid-cols-2 items-center gap-[8px] rounded-[13px] bg-white px-[13px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]"
            >
                <Link
                    href={buy(supplier.id).url}
                    className="flex h-[31px] items-center justify-center rounded-[8px] border border-[#dedede] text-[10px] font-medium text-[#0e223e]"
                >
                    Kembali Belanja
                </Link>
                <button
                    disabled={processing}
                    type="submit"
                    className="flex h-[31px] items-center justify-center rounded-[8px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[10px] font-medium text-[#121212] disabled:opacity-60"
                >
                    {processing ? 'Memproses...' : 'Buat Pesanan'}
                </button>
            </form>
        </>
    );
}

function OrderProductRow({
    supplier,
    product,
    fallbackPosition,
}: {
    supplier: Supplier;
    product: CartItem;
    fallbackPosition: string;
}) {
    const updateQuantity = (quantity: number) =>
        router.patch(
            updateCart([supplier.id, product.id]).url,
            { quantity },
            { preserveScroll: true, only: ['cart'] },
        );
    const remove = () =>
        router.delete(destroyCart([supplier.id, product.id]).url, {
            preserveScroll: true,
        });

    return (
        <article className="relative flex h-[57px] items-center rounded-[9px] border border-[#eeeeee] px-[7px]">
            <span className="relative size-[48px] shrink-0 overflow-hidden rounded-[7px] bg-[#fffaf0]">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt=""
                        className="size-full object-contain p-1"
                    />
                ) : (
                    <span
                        aria-hidden="true"
                        className="absolute top-[4px] left-[4px] h-[42px] w-[54px] bg-no-repeat"
                        style={{
                            backgroundImage: `url(${productReference})`,
                            backgroundPosition: fallbackPosition,
                            backgroundSize: '220px auto',
                        }}
                    />
                )}
            </span>
            <div className="ml-2 min-w-0 flex-1">
                <h3 className="truncate text-[9px] leading-3 font-semibold text-[#0e223e]">
                    {product.name}
                </h3>
                <p className="text-[8px] leading-3 text-[#858585]">
                    {currency.format(product.price)} • stok {product.stock}
                </p>
                <div className="mt-1 flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() =>
                            product.quantity === 1
                                ? remove()
                                : updateQuantity(product.quantity - 1)
                        }
                        aria-label={`Kurangi ${product.name}`}
                        className="flex size-[18px] items-center justify-center rounded-[5px] border border-[#ffb500] text-[#f29a00]"
                    >
                        <Minus className="size-3" />
                    </button>
                    <span className="min-w-5 text-center text-[9px] font-semibold">
                        {product.quantity}
                    </span>
                    <button
                        disabled={product.quantity >= product.stock}
                        type="button"
                        onClick={() => updateQuantity(product.quantity + 1)}
                        aria-label={`Tambah ${product.name}`}
                        className="flex size-[18px] items-center justify-center rounded-[5px] bg-[#ffb500] text-white disabled:opacity-40"
                    >
                        <Plus className="size-3" />
                    </button>
                </div>
            </div>
            <button
                type="button"
                onClick={remove}
                aria-label={`Hapus ${product.name}`}
                className="absolute top-[6px] right-[8px] text-[#777]"
            >
                <Trash2 aria-hidden="true" className="size-[14px]" />
            </button>
            <p className="absolute right-[8px] bottom-[5px] text-[8px] leading-3">
                {currency.format(product.subtotal)}
            </p>
        </article>
    );
}

function PaymentRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <dt>{label}</dt>
            <dd className="font-semibold text-[#0e223e]">{value}</dd>
        </div>
    );
}
