import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Boxes,
    Plus,
    ShoppingBasket,
    SlidersHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import { checkout, index as supplierList } from '@/routes/suppliers';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import productReference from '../../../../Design/POS/stock-out.png';
import {
    formatRupiah,
    getSelectedSupplier,
    supplierOrderItemCount,
    supplierOrderProducts,
} from './supplier-order-data';
import type { SupplierOrderProduct } from './supplier-order-data';

const categories = ['Semua', 'Sembako', 'Minuman', 'Frozen', 'Rumah Tangga'];

export default function BuyProduct() {
    const supplier = getSelectedSupplier(usePage().url);

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
                        <span className="absolute top-[7px] right-[7px] size-[7px] rounded-full bg-[#ed1717] ring-1 ring-[#68778a]" />
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

            <section className="relative z-10 mx-4 -mt-[20px] rounded-[18px] bg-white px-3 pt-3 pb-[13px] shadow-[0_6px_18px_rgba(253,185,0,0.07)]">
                <div className="flex items-center gap-[10px]">
                    <AppPageHeaderSearch
                        readOnly
                        aria-label="Cari produk supplier"
                        placeholder="Cari produk grosir"
                        wrapperClassName="flex h-[32px] min-w-0 flex-1 items-center rounded-[10px] bg-[#fbfbfb] px-3 text-[#555]"
                        iconClassName="size-[17px] shrink-0 text-[#777]"
                        inputClassName="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#858585]"
                    />
                    <button
                        type="button"
                        aria-label="Filter produk supplier"
                        className="flex size-[32px] shrink-0 items-center justify-center rounded-[9px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[#0e223e]"
                    >
                        <SlidersHorizontal
                            aria-hidden="true"
                            className="size-[17px]"
                            strokeWidth={2}
                        />
                    </button>
                </div>

                <div className="mt-[12px] grid h-[23px] grid-cols-[49px_61px_62px_57px_91px] gap-[5px]">
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            type="button"
                            aria-pressed={index === 0}
                            className={`rounded-full text-[8px] font-medium whitespace-nowrap ${index === 0 ? 'bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[#121212]' : 'border border-[#e0e0e0] bg-white text-[#353535]'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            <section className="mx-4 grid h-[53px] grid-cols-2 rounded-[13px] bg-white px-4 shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                <OrderSummary icon={Boxes} value="36" label="Produk Grosir" />
                <OrderSummary
                    icon={ShoppingBasket}
                    value="8"
                    label="Item Pesanan"
                    bordered
                />
            </section>

            <section
                aria-label="Produk supplier"
                className="mx-[19px] mt-[7px] -mb-4 grid grid-cols-2 gap-[7px]"
            >
                {supplierOrderProducts.map((product) => (
                    <SupplierProductCard key={product.key} product={product} />
                ))}
            </section>

            <Link
                href={checkout({ query: { supplier: supplier.slug } }).url}
                aria-label={`Buka keranjang, ${supplierOrderItemCount} item`}
                className="fixed bottom-[63px] left-[calc(50%+151px)] z-40 flex size-[54px] -translate-x-1/2 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[#0e223e] shadow-[0_7px_16px_rgba(253,185,0,0.28)]"
            >
                <ShoppingBasket
                    aria-hidden="true"
                    className="size-[25px] fill-[#0e223e]"
                    strokeWidth={1.7}
                />
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#e9002b] text-[10px] font-bold text-white">
                    {supplierOrderItemCount}
                </span>
            </Link>
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

function SupplierProductCard({ product }: { product: SupplierOrderProduct }) {
    return (
        <article className="relative h-[155px] overflow-hidden rounded-[11px] bg-white px-[10px] shadow-[0_4px_12px_rgba(14,34,62,0.045)]">
            <span
                aria-hidden="true"
                className={`absolute bg-no-repeat ${product.imageClass}`}
                style={{
                    backgroundImage: `url(${productReference})`,
                    backgroundPosition: product.imagePosition,
                    backgroundSize: '393px auto',
                }}
            />
            <div className="absolute right-[10px] bottom-[7px] left-[10px]">
                <h2 className="truncate text-[11px] leading-4 font-semibold">
                    {product.name}
                </h2>
                <p className="text-[12px] leading-4 font-medium text-[#f48700]">
                    {formatRupiah(product.price)}
                </p>
                <p className="truncate text-[8px] leading-3 text-[#5f5f5f]">
                    {product.unit}
                </p>
                <p className="text-[8px] leading-3 text-[#858585]">
                    {product.stock}
                </p>
            </div>
            <button
                type="button"
                aria-label={`Tambahkan ${product.name} ke pesanan`}
                className="absolute right-[12px] bottom-[9px] flex size-[24px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white"
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
