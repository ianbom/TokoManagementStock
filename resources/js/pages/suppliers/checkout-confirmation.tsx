import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, Minus, Plus, Store, Trash2 } from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import { buy, notification } from '@/routes/suppliers';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import productReference from '../../../../Design/POS/stock-out.png';
import {
    formatRupiah,
    getSelectedSupplier,
    supplierOrderCart,
    supplierOrderItemCount,
    supplierOrderTotal,
} from './supplier-order-data';
import type { SupplierOrderProduct } from './supplier-order-data';

const thumbnailStyles: Record<string, { className: string; position: string }> =
    {
        'indomie-dus': {
            className: 'left-[4px] top-[5px] h-[40px] w-[54px]',
            position: '-32px -157px',
        },
        'aqua-dus': {
            className: 'left-[23px] top-[3px] h-[44px] w-[15px]',
            position: '-151px -153px',
        },
        'minyak-karton': {
            className: 'left-[14px] top-[3px] h-[44px] w-[35px]',
            position: '-40px -242px',
        },
        'gula-karung': {
            className: 'left-[12px] top-[4px] h-[42px] w-[40px]',
            position: '-39px -333px',
        },
    };

export default function SupplierCheckoutConfirmation() {
    const supplier = getSelectedSupplier(usePage().url);

    const query = { supplier: supplier.slug };

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
                        href={buy({ query }).url}
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
                        <span className="absolute top-[6px] right-[6px] size-[7px] rounded-full bg-[#ed1717] ring-1 ring-[#68778a]" />
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
                <h2 className="text-[13px] leading-4 font-bold text-[#0e223e]">
                    Produk Pesanan
                </h2>
                <div className="mt-[7px] space-y-[4px]">
                    {supplierOrderCart.map((product) => (
                        <OrderProductRow key={product.key} product={product} />
                    ))}
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[12px] pt-[8px] pb-[7px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <h2 className="text-[13px] leading-4 font-bold text-[#0e223e]">
                    Informasi Pengiriman
                </h2>
                <label className="mt-[4px] block text-[9px] leading-3 text-[#454545]">
                    Alamat Pengiriman
                    <input
                        readOnly
                        value="Jl. Ketintang Madya No. 10, Surabaya"
                        className="mt-0.5 h-[24px] w-full rounded-[8px] border border-[#dedede] bg-white px-[9px] text-[9px] outline-none"
                    />
                </label>
                <label className="mt-[4px] block text-[9px] leading-3 text-[#454545]">
                    Catatan (optional)
                    <input
                        readOnly
                        placeholder="Tambahkan catatan untuk supplier"
                        className="mt-0.5 h-[24px] w-full rounded-[8px] border border-[#dedede] bg-white px-[9px] text-[9px] outline-none placeholder:text-[#8a8a8a]"
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
                        value={String(supplierOrderItemCount)}
                    />
                    <PaymentRow
                        label="Subtotal"
                        value={formatRupiah(supplierOrderTotal)}
                    />
                    <PaymentRow label="Ongkir" value="Rp 0" />
                    <PaymentRow label="Diskon" value="Rp 0" />
                </dl>
                <div className="mt-[3px] flex items-center justify-between border-t border-[#e4e4e4] pt-[3px]">
                    <span className="text-[12px] leading-4 font-bold text-[#0e223e]">
                        Total Pesanan
                    </span>
                    <span className="text-[15px] leading-4 font-semibold text-[#f06c00]">
                        {formatRupiah(supplierOrderTotal)}
                    </span>
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] -mb-[50px] grid h-[50px] grid-cols-[105px_94px_1fr] items-center gap-[8px] rounded-[13px] bg-white px-[13px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <div>
                    <p className="text-[9px] leading-3">Total</p>
                    <p className="text-[14px] leading-5 font-semibold text-[#f06c00]">
                        {formatRupiah(supplierOrderTotal)}
                    </p>
                </div>
                <Link
                    href={buy({ query }).url}
                    className="flex h-[29px] items-center justify-center rounded-[8px] border border-[#dedede] text-[9px] font-medium text-[#0e223e]"
                >
                    Kembali Belanja
                </Link>
                <Link
                    href={notification({ query }).url}
                    className="flex h-[29px] items-center justify-center rounded-[8px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[9px] font-medium text-[#121212]"
                >
                    Buat Pesanan
                </Link>
            </section>
        </>
    );
}

function OrderProductRow({ product }: { product: SupplierOrderProduct }) {
    const thumbnail = thumbnailStyles[product.key];

    return (
        <article className="relative h-[48px] rounded-[9px] border border-[#eeeeee] bg-white shadow-[0_3px_10px_rgba(14,34,62,0.035)]">
            <span
                className="absolute top-0 left-0 h-[48px] w-[66px] overflow-hidden rounded-l-[9px]"
                aria-hidden="true"
            >
                <span
                    className={`absolute bg-no-repeat ${thumbnail.className}`}
                    style={{
                        backgroundImage: `url(${productReference})`,
                        backgroundPosition: thumbnail.position,
                        backgroundSize: '220px auto',
                    }}
                />
            </span>
            <div className="absolute top-[8px] left-[68px]">
                <h3 className="max-w-[112px] truncate text-[9px] leading-3 font-semibold text-[#0e223e]">
                    {product.name}
                </h3>
                <p className="mt-[2px] text-[8px] leading-3 text-[#f06c00]">
                    {formatRupiah(product.price)}
                </p>
            </div>
            <div className="absolute top-[14px] left-[184px] flex items-center gap-[6px]">
                <button
                    type="button"
                    aria-label={`Kurangi ${product.name}`}
                    className="flex size-[18px] items-center justify-center rounded-[5px] bg-[#ffb500] text-white"
                >
                    <Minus aria-hidden="true" className="size-3" />
                </button>
                <output className="flex h-[21px] w-[21px] items-center justify-center rounded-[5px] border border-[#dedede] text-[10px]">
                    {product.quantity}
                </output>
                <button
                    type="button"
                    aria-label={`Tambah ${product.name}`}
                    className="flex size-[18px] items-center justify-center rounded-[5px] bg-[#ffb500] text-white"
                >
                    <Plus aria-hidden="true" className="size-3" />
                </button>
            </div>
            <button
                type="button"
                aria-label={`Hapus ${product.name}`}
                className="absolute top-[6px] right-[10px] text-[#777]"
            >
                <Trash2 aria-hidden="true" className="size-[14px]" />
            </button>
            <p className="absolute right-[8px] bottom-[5px] text-[8px] leading-3">
                {formatRupiah(product.price * product.quantity)}
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
