import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Bell, Box, Minus, Plus, Trash2 } from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import { index as pos } from '@/routes/pos';
import {
    destroy as removeCartItem,
    update as updateCartItem,
} from '@/routes/pos/cart';
import { store as completeCheckout } from '@/routes/pos/checkout';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import checkoutReference from '../../../../Design/POS/checkout-confirmation.png';
import { checkoutProducts as artworkProducts } from './checkout-data';

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    stock: number;
    image_url: string | null;
};

type PageProps = {
    cart: {
        items: CartItem[];
        item_count: number;
        subtotal: number;
        total: number;
    };
};

export default function CheckoutConfirmation({ cart }: PageProps) {
    const form = useForm({ customer_name: '', notes: '' });
    const cartError = (form.errors as Record<string, string>).cart;

    const changeQuantity = (product: CartItem, quantity: number) => {
        if (quantity < 1) {
            router.delete(removeCartItem(product.id).url, {
                preserveScroll: true,
            });

            return;
        }

        router.patch(
            updateCartItem(product.id).url,
            { quantity },
            { preserveScroll: true },
        );
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(completeCheckout().url);
    };

    return (
        <>
            <Head title="Konfirmasi Checkout" />

            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[118px] rounded-b-[29px] bg-[position:64%_center] px-[17px] pt-[10px] text-white"
            >
                <div className="relative flex items-center justify-between">
                    <Link
                        href={pos().url}
                        aria-label="Kembali ke POS"
                        className="flex size-[33px] items-center justify-center rounded-[13px] border border-white/25 bg-white/5 text-white backdrop-blur-[2px]"
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
                        className="relative flex size-[33px] items-center justify-center rounded-full bg-white/20 backdrop-blur-[2px]"
                    >
                        <Bell
                            aria-hidden="true"
                            className="size-[19px] fill-white text-white"
                            strokeWidth={1.7}
                        />
                        <span className="absolute top-[6px] right-[6px] size-[7px] rounded-full bg-[#ed1717] ring-1 ring-[#68778a]" />
                    </button>
                </div>

                <AppPageHeaderHeading
                    title="Konfirmasi Checkout"
                    description="Periksa pesanan sebelum menyelesaikan transaksi"
                    className="relative mt-[9px]"
                    titleClassName="text-[25px] leading-[29px] font-bold tracking-[-0.45px]"
                    descriptionClassName="mt-0.5 text-[11px] leading-4 text-white/95"
                />
            </AppPageHeader>

            <form onSubmit={submit}>
                <section className="relative z-10 mx-[13px] -mt-4 rounded-[13px] bg-white px-[11px] pt-[12px] pb-1 shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                    <h2 className="text-[13px] leading-4 font-bold text-[#0e223e]">
                        Produk di Keranjang
                    </h2>
                    <div className="mt-[9px] space-y-[4px]">
                        {cart.items.map((product) => (
                            <CheckoutProductCard
                                key={product.id}
                                product={product}
                                onQuantityChange={(quantity) =>
                                    changeQuantity(product, quantity)
                                }
                                onRemove={() =>
                                    router.delete(
                                        removeCartItem(product.id).url,
                                        { preserveScroll: true },
                                    )
                                }
                            />
                        ))}
                        {cart.items.length === 0 ? (
                            <p className="py-5 text-center text-[10px] text-[#666]">
                                Keranjang masih kosong.
                            </p>
                        ) : null}
                    </div>
                </section>

                <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[12px] pt-2 pb-[5px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                    <h2 className="text-[13px] leading-[14px] font-bold text-[#0e223e]">
                        Informasi Transaksi
                    </h2>
                    <label className="mt-[3px] block text-[9px] leading-3 text-[#454545]">
                        Nama Pelanggan (optional)
                        <input
                            value={form.data.customer_name}
                            onChange={(event) =>
                                form.setData(
                                    'customer_name',
                                    event.target.value,
                                )
                            }
                            type="text"
                            placeholder="Masukkan nama pelanggan"
                            className="mt-0.5 h-[24px] w-full rounded-[9px] border border-[#dedede] bg-white px-[10px] text-[9px] outline-none placeholder:text-[#8a8a8a]"
                        />
                    </label>
                    <label className="mt-1 block text-[9px] leading-3 text-[#454545]">
                        Catatan (optional)
                        <textarea
                            value={form.data.notes}
                            onChange={(event) =>
                                form.setData('notes', event.target.value)
                            }
                            rows={2}
                            placeholder="Tambahkan catatan jika diperlukan"
                            className="mt-0.5 h-[38px] w-full resize-none rounded-[9px] border border-[#dedede] bg-white px-[10px] py-[6px] text-[9px] outline-none placeholder:text-[#8a8a8a]"
                        />
                    </label>
                </section>

                <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[12px] pt-[8px] pb-[6px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                    <h2 className="text-[13px] leading-[14px] font-bold text-[#0e223e]">
                        Ringkasan Pembayaran
                    </h2>
                    <dl className="mt-0.5 text-[9px] leading-[11px] text-[#333]">
                        <PaymentRow
                            label="Jumlah Item"
                            value={cart.item_count.toString()}
                        />
                        <PaymentRow
                            label="Subtotal"
                            value={formatCurrency(cart.subtotal)}
                        />
                        <PaymentRow label="Diskon" value={formatCurrency(0)} />
                        <PaymentRow label="Pajak" value={formatCurrency(0)} />
                    </dl>
                    <div className="mt-[3px] flex items-center justify-between border-t border-[#e4e4e4] pt-[3px]">
                        <span className="text-[12px] leading-4 font-bold text-[#0e223e]">
                            Total Harga
                        </span>
                        <span className="text-[15px] leading-4 font-semibold text-[#f06c00]">
                            {formatCurrency(cart.total)}
                        </span>
                    </div>
                    {cartError ? (
                        <p className="mt-1 text-[9px] text-red-600">
                            {cartError}
                        </p>
                    ) : null}
                </section>

                <section className="mx-[13px] mt-[6px] -mb-[50px] grid h-[50px] grid-cols-[105px_94px_1fr] items-center gap-[8px] rounded-[13px] bg-white px-[13px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                    <div>
                        <p className="text-[9px] leading-3 text-[#313131]">
                            Total
                        </p>
                        <p className="text-[15px] leading-5 font-semibold text-[#f06c00]">
                            {formatCurrency(cart.total)}
                        </p>
                    </div>
                    <Link
                        href={pos().url}
                        className="flex h-[29px] items-center justify-center rounded-[8px] border border-[#dedede] bg-white text-[9px] font-medium text-[#0e223e]"
                    >
                        Kembali ke POS
                    </Link>
                    <button
                        disabled={cart.items.length === 0 || form.processing}
                        type="submit"
                        className="flex h-[29px] items-center justify-center rounded-[8px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[9px] font-medium text-[#121212] shadow-[0_4px_9px_rgba(253,185,0,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {form.processing
                            ? 'Memproses...'
                            : 'Selesaikan Transaksi'}
                    </button>
                </section>
            </form>
        </>
    );
}

function CheckoutProductCard({
    product,
    onQuantityChange,
    onRemove,
}: {
    product: CartItem;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}) {
    const artwork = artworkProducts.find((item) => item.name === product.name);

    return (
        <article className="relative h-[48px] rounded-[9px] border border-[#eeeeee] bg-white shadow-[0_3px_10px_rgba(14,34,62,0.035)]">
            {product.image_url ? (
                <img
                    src={product.image_url}
                    alt=""
                    className="absolute top-1 left-[10px] h-10 w-[57px] object-contain"
                />
            ) : artwork ? (
                <span
                    aria-hidden="true"
                    className={`absolute bg-no-repeat ${artwork.imageClass}`}
                    style={{
                        backgroundImage: `url(${checkoutReference})`,
                        backgroundPosition: artwork.imagePosition,
                        backgroundSize: '393px auto',
                    }}
                />
            ) : (
                <Box
                    aria-hidden="true"
                    className="absolute top-3 left-[29px] size-6 text-[#ff9300]"
                />
            )}
            <div className="absolute top-[10px] left-[77px] max-w-[105px]">
                <h3 className="truncate text-[10px] leading-3 font-semibold text-[#0e223e]">
                    {product.name}
                </h3>
                <p className="mt-[3px] text-[9px] leading-3 text-[#f06c00]">
                    {formatCurrency(product.price)}
                </p>
            </div>
            <div className="absolute top-[15px] left-[187px] flex items-center gap-[8px]">
                <button
                    type="button"
                    onClick={() => onQuantityChange(product.quantity - 1)}
                    aria-label={`Kurangi ${product.name}`}
                    className="flex size-[18px] items-center justify-center rounded-[5px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white"
                >
                    <Minus
                        aria-hidden="true"
                        className="size-3"
                        strokeWidth={2.4}
                    />
                </button>
                <output className="flex h-[21px] w-[21px] items-center justify-center rounded-[5px] border border-[#dedede] text-[10px]">
                    {product.quantity}
                </output>
                <button
                    type="button"
                    disabled={product.quantity >= product.stock}
                    onClick={() => onQuantityChange(product.quantity + 1)}
                    aria-label={`Tambah ${product.name}`}
                    className="flex size-[18px] items-center justify-center rounded-[5px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white disabled:opacity-40"
                >
                    <Plus
                        aria-hidden="true"
                        className="size-3"
                        strokeWidth={2.4}
                    />
                </button>
            </div>
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Hapus ${product.name}`}
                className="absolute top-[7px] right-[13px] text-[#777]"
            >
                <Trash2
                    aria-hidden="true"
                    className="size-[15px]"
                    strokeWidth={1.8}
                />
            </button>
            <p className="absolute right-[9px] bottom-[6px] text-[9px] leading-3 text-[#333]">
                {formatCurrency(product.subtotal)}
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

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}
