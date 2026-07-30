import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bell, Check, CircleCheck, Store } from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import { dashboard } from '@/routes';
import { buy, index as supplierList } from '@/routes/suppliers';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';

type Supplier = {
    id: number;
    name: string;
    category: string | null;
    address: string;
};
type OrderItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
};
type Order = {
    id: number;
    order_number: string;
    status: string;
    completed_at: string | null;
    total: number;
    supplier: Supplier;
    items: OrderItem[];
};

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function SupplierCheckoutNotification({
    order,
}: {
    order: Order;
}) {
    const itemCount = order.items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    return (
        <>
            <Head title="Pesanan Supplier Berhasil" />
            <style>{'html { scrollbar-gutter: auto; }'}</style>

            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[118px] rounded-b-[29px] bg-[position:64%_center] px-[17px] pt-[10px] text-white"
            >
                <div className="relative flex items-center justify-between">
                    <Link
                        href={supplierList().url}
                        aria-label="Kembali ke daftar supplier"
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
                    title="Pesanan Selesai"
                    description="Stok telah dipindahkan ke persediaan Anda"
                    className="relative mt-[9px]"
                    titleClassName="text-[25px] leading-[29px] font-bold tracking-[-0.45px]"
                    descriptionClassName="mt-0.5 text-[11px] leading-4 text-white/95"
                />
            </AppPageHeader>

            <section className="relative z-10 mx-[13px] -mt-4 flex h-[91px] flex-col items-center justify-center rounded-[13px] bg-white shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <span className="flex size-[42px] items-center justify-center rounded-full bg-[#e8f8ef] text-[#32a96a]">
                    <Check
                        aria-hidden="true"
                        className="size-[25px]"
                        strokeWidth={3}
                    />
                </span>
                <h2 className="mt-[5px] text-[13px] leading-4 font-bold text-[#0e223e]">
                    Pesanan Berhasil Diselesaikan
                </h2>
                <p className="text-[9px] leading-3 text-[#858585]">
                    {order.order_number}
                </p>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[13px] py-[9px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <div className="flex items-center gap-3">
                    <span className="flex size-[34px] items-center justify-center rounded-full bg-[#fff0cd] text-[#f29a00]">
                        <Store aria-hidden="true" className="size-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-[12px] leading-4 font-bold text-[#0e223e]">
                            {order.supplier.name}
                        </h2>
                        <p className="truncate text-[9px] leading-3 text-[#858585]">
                            {order.supplier.address}
                        </p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-[#e8f8ef] px-2 py-1 text-[8px] font-semibold text-[#32a96a]">
                        <CircleCheck
                            aria-hidden="true"
                            className="size-[10px]"
                        />
                        Selesai
                    </span>
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[11px] pt-[9px] pb-[7px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <div className="flex items-center justify-between">
                    <h2 className="text-[13px] leading-4 font-bold text-[#0e223e]">
                        Detail Pesanan
                    </h2>
                    <span className="text-[9px] text-[#858585]">
                        {itemCount} item
                    </span>
                </div>
                <div className="mt-[6px] space-y-[3px]">
                    {order.items.map((item) => (
                        <article
                            key={item.id}
                            className="flex h-[38px] items-center justify-between rounded-[8px] border border-[#eeeeee] px-[10px]"
                        >
                            <div className="min-w-0">
                                <h3 className="truncate text-[9px] leading-3 font-semibold text-[#0e223e]">
                                    {item.name}
                                </h3>
                                <p className="text-[8px] leading-3 text-[#858585]">
                                    {item.quantity} ×{' '}
                                    {currency.format(item.price)}
                                </p>
                            </div>
                            <p className="text-[9px] font-semibold text-[#f06c00]">
                                {currency.format(item.subtotal)}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] rounded-[13px] bg-white px-[13px] py-[9px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <div className="flex items-center justify-between text-[9px]">
                    <span>Status Pesanan</span>
                    <strong className="text-[#32a96a]">
                        Selesai {formatDate(order.completed_at)}
                    </strong>
                </div>
                <div className="mt-[5px] flex items-center justify-between border-t border-[#e4e4e4] pt-[5px]">
                    <span className="text-[12px] font-bold text-[#0e223e]">
                        Total Pesanan
                    </span>
                    <strong className="text-[15px] text-[#f06c00]">
                        {currency.format(order.total)}
                    </strong>
                </div>
            </section>

            <section className="mx-[13px] mt-[6px] -mb-[50px] grid h-[50px] grid-cols-2 items-center gap-[8px] rounded-[13px] bg-white px-[13px] shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <Link
                    href={buy(order.supplier.id).url}
                    className="flex h-[31px] items-center justify-center rounded-[8px] border border-[#dedede] text-[10px] font-medium text-[#0e223e]"
                >
                    Belanja Lagi
                </Link>
                <Link
                    href={dashboard().url}
                    className="flex h-[31px] items-center justify-center rounded-[8px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[10px] font-medium text-[#121212]"
                >
                    Kembali ke Dashboard
                </Link>
            </section>
        </>
    );
}

function formatDate(value: string | null) {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}
