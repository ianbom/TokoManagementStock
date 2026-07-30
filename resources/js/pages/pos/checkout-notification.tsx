import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bell, Box, CircleCheck } from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import { dashboard } from '@/routes';
import { index as pos } from '@/routes/pos';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import checkoutReference from '../../../../Design/POS/checkout-confirmation.png';
import { checkoutProducts as artworkProducts } from './checkout-data';

type SaleItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
};

type PageProps = {
    sale: {
        id: number;
        invoice_number: string;
        customer_name: string | null;
        notes: string | null;
        completed_at: string | null;
        total: number;
        items: SaleItem[];
    };
};

export default function CheckoutNotification({ sale }: PageProps) {
    const itemCount = sale.items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return (
        <>
            <Head title="Checkout Berhasil" />

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
                    title="Checkout Berhasil"
                    description="Transaksi telah selesai dan tercatat"
                    className="relative mt-[9px]"
                    titleClassName="text-[25px] leading-[29px] font-bold tracking-[-0.45px]"
                    descriptionClassName="mt-0.5 text-[11px] leading-4 text-white/95"
                />
            </AppPageHeader>

            <section className="relative z-10 mx-[13px] -mt-4 flex h-[76px] items-center rounded-[13px] bg-white px-[15px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#e7f8f3] text-[#08a98f]">
                    <CircleCheck
                        aria-hidden="true"
                        className="size-[27px]"
                        strokeWidth={2.2}
                    />
                </span>
                <div className="ml-[13px] min-w-0">
                    <h2 className="text-[14px] leading-[18px] font-bold text-[#0e223e]">
                        Transaksi Berhasil
                    </h2>
                    <p className="mt-0.5 truncate text-[10px] leading-4 text-[#666]">
                        {sale.invoice_number} · {formatCurrency(sale.total)}
                    </p>
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[12px] py-[8px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <dl className="text-[9px] leading-[13px] text-[#333]">
                    <PaymentRow
                        label="Pelanggan"
                        value={sale.customer_name || 'Umum'}
                    />
                    <PaymentRow
                        label="Waktu"
                        value={formatDate(sale.completed_at)}
                    />
                    {sale.notes ? (
                        <PaymentRow label="Catatan" value={sale.notes} />
                    ) : null}
                </dl>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[11px] pt-[10px] pb-[7px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <h2 className="text-[13px] leading-4 font-bold text-[#0e223e]">
                    Ringkasan Produk
                </h2>
                <div className="mt-[7px] space-y-[4px]">
                    {sale.items.map((product) => (
                        <CheckoutResultProduct
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[12px] pt-[9px] pb-[8px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <h2 className="text-[13px] leading-[14px] font-bold text-[#0e223e]">
                    Ringkasan Pembayaran
                </h2>
                <dl className="mt-1 text-[9px] leading-[13px] text-[#333]">
                    <PaymentRow
                        label="Jumlah Item"
                        value={itemCount.toString()}
                    />
                    <PaymentRow
                        label="Subtotal"
                        value={formatCurrency(sale.total)}
                    />
                    <PaymentRow label="Diskon" value={formatCurrency(0)} />
                    <PaymentRow label="Pajak" value={formatCurrency(0)} />
                </dl>
                <div className="mt-[4px] flex items-center justify-between border-t border-[#e4e4e4] pt-[5px]">
                    <span className="text-[12px] leading-4 font-bold text-[#0e223e]">
                        Total Harga
                    </span>
                    <span className="text-[15px] leading-4 font-semibold text-[#f06c00]">
                        {formatCurrency(sale.total)}
                    </span>
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] grid gap-[7px] rounded-[13px] bg-white p-[10px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <Link
                    href={pos().url}
                    className="flex h-[36px] items-center justify-center rounded-[9px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[11px] font-medium text-[#121212] shadow-[0_4px_9px_rgba(253,185,0,0.18)]"
                >
                    Transaksi Baru
                </Link>
                <Link
                    href={dashboard().url}
                    className="flex h-[36px] items-center justify-center rounded-[9px] border border-[#dedede] bg-white text-[11px] font-medium text-[#0e223e]"
                >
                    Kembali ke Dashboard
                </Link>
            </section>
        </>
    );
}

function CheckoutResultProduct({ product }: { product: SaleItem }) {
    const artwork = artworkProducts.find((item) => item.name === product.name);

    return (
        <article className="relative h-[48px] rounded-[9px] border border-[#eeeeee] bg-white shadow-[0_3px_10px_rgba(14,34,62,0.035)]">
            {artwork ? (
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
            <div className="absolute top-[9px] left-[77px] min-w-0">
                <h3 className="max-w-[145px] truncate text-[10px] leading-3 font-semibold text-[#0e223e]">
                    {product.name}
                </h3>
                <p className="mt-[3px] text-[9px] leading-3 text-[#666]">
                    {product.quantity} x {formatCurrency(product.price)}
                </p>
            </div>
            <p className="absolute top-[18px] right-[10px] text-[10px] leading-3 font-semibold text-[#f06c00]">
                {formatCurrency(product.subtotal)}
            </p>
        </article>
    );
}

function PaymentRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="shrink-0">{label}</dt>
            <dd className="truncate text-right font-semibold text-[#0e223e]">
                {value}
            </dd>
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

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}
