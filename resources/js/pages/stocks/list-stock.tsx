import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Camera,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    ClipboardList,
    Layers3,
    ListFilter,
    LoaderCircle,
    Save,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { update } from '@/routes/stocks';
import stockReference from '../../../../Design/Stock/list-stock.png';

type Product = {
    id: number;
    name: string;
    stock: number;
    purchase_price: number;
    selling_price: number;
    image: string | null;
};

type Summary = {
    total_products: number;
    total_stock: number;
    low_stock: number;
};
type Paginated<T> = {
    data: T[];
    prev_page_url: string | null;
    next_page_url: string | null;
};
type EditProductForm = {
    _method: 'patch';
    name: string;
    stock: number;
    purchase_price: number;
    selling_price: number;
    image: File | null;
};

const categories = ['Semua', 'Makanan', 'Minuman', 'Kebutuhan Harian'];
const fallbackImages = [
    ['left-[52px] top-[6px] h-[76px] w-[63px]', '-68px -251px'],
    ['left-[46px] top-[10px] h-[65px] w-[84px]', '-244px -255px'],
    ['left-[68px] top-[10px] h-[78px] w-[30px]', '-84px -396px'],
    ['left-[54px] top-[11px] h-[77px] w-[57px]', '-252px -397px'],
    ['left-[57px] top-[9px] h-[76px] w-[48px]', '-73px -536px'],
    ['left-[69px] top-[10px] h-[69px] w-[37px]', '-267px -537px'],
] as const;

const currency = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export default function ListStock({
    products,
    summary,
}: {
    products: Paginated<Product>;
    summary: Summary;
}) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
                    className="mt-[7px] grid h-[73px] w-full grid-cols-3 rounded-[10px] bg-white shadow-[0_5px_16px_rgba(14,34,62,0.05)]"
                >
                    <StockSummary
                        icon={Box}
                        label="Total Produk"
                        value={String(summary.total_products)}
                        color="text-[#ff9800]"
                    />
                    <StockSummary
                        icon={Layers3}
                        label="Total Stock"
                        value={String(summary.total_stock)}
                        color="text-[#09a992]"
                        bordered
                    />
                    <StockSummary
                        icon={CircleAlert}
                        label="Stok Menipis"
                        value={String(summary.low_stock)}
                        color="text-[#ef3526]"
                        bordered
                    />
                </section>

                <h2 className="mt-[11px] text-[15px] leading-5 font-bold tracking-[-0.2px]">
                    Daftar Produk
                </h2>
                <section
                    aria-label="Daftar produk"
                    className="mt-[7px] grid w-full grid-cols-2 gap-x-[8px] gap-y-[10px]"
                >
                    {products.data.length ? (
                        products.data.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => setEditingProduct(product)}
                                fallback={
                                    fallbackImages[
                                        index % fallbackImages.length
                                    ]
                                }
                            />
                        ))
                    ) : (
                        <p className="col-span-2 rounded-[10px] bg-white px-4 py-8 text-center text-[12px] text-[#858585]">
                            Belum ada produk dalam persediaan.
                        </p>
                    )}
                </section>
                <Pagination
                    previous={products.prev_page_url}
                    next={products.next_page_url}
                />
            </div>
            {editingProduct && (
                <EditProductDialog
                    key={editingProduct.id}
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}
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

function ProductCard({
    product,
    fallback,
    onClick,
}: {
    product: Product;
    fallback: (typeof fallbackImages)[number];
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Edit ${product.name}`}
            className="relative h-[132px] overflow-hidden rounded-[10px] bg-white px-[10px] text-left shadow-[0_4px_12px_rgba(14,34,62,0.045)] transition active:scale-[0.98]"
        >
            {product.image ? (
                <img
                    src={imageUrl(product.image)}
                    alt=""
                    className="absolute top-2 left-1/2 h-[78px] w-[92px] -translate-x-1/2 object-contain"
                />
            ) : (
                <span
                    aria-hidden="true"
                    className={`absolute bg-no-repeat ${fallback[0]}`}
                    style={{
                        backgroundImage: `url(${stockReference})`,
                        backgroundPosition: fallback[1],
                        backgroundSize: '393px auto',
                    }}
                />
            )}
            <div className="absolute right-[10px] bottom-[2px] left-[10px]">
                <h3 className="truncate text-[10px] leading-4 font-semibold">
                    {product.name}
                </h3>
                <p className="text-[11px] leading-4 font-medium text-[#ff9800]">
                    {currency.format(product.selling_price)}
                </p>
                <p className="text-[9px] leading-4 text-[#777]">
                    Stock: {product.stock} pcs
                </p>
            </div>
            <span
                aria-hidden="true"
                className="absolute right-[11px] bottom-[5px] flex size-[23px] items-center justify-center rounded-full bg-[#08aa92] text-white shadow-[0_3px_7px_rgba(0,159,128,0.22)]"
            >
                <ClipboardList
                    aria-hidden="true"
                    className="size-[14px]"
                    strokeWidth={2}
                />
            </span>
        </button>
    );
}

function EditProductDialog({
    product,
    onClose,
}: {
    product: Product;
    onClose: () => void;
}) {
    const form = useForm<EditProductForm>({
        _method: 'patch',
        name: product.name,
        stock: product.stock,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        image: null,
    });
    const [preview, setPreview] = useState<string | null>(
        product.image ? imageUrl(product.image) : null,
    );

    useEffect(
        () => () => {
            if (preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        },
        [preview],
    );

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(update(product.id).url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[88dvh] w-[calc(100%-28px)] max-w-[365px] overflow-y-auto rounded-[22px] border-0 bg-[#fff9e8] p-5 text-[#252525]">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-[18px] font-bold">
                        Edit Produk
                    </DialogTitle>
                    <DialogDescription className="text-[11px] text-[#858585]">
                        Perbarui informasi dan jumlah stok produk.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3">
                    <label className="relative flex h-[112px] cursor-pointer items-center justify-center overflow-hidden rounded-[16px] border border-dashed border-[#f1b229] bg-white">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview produk"
                                className="size-full object-contain p-3"
                            />
                        ) : (
                            <span className="flex flex-col items-center gap-1 text-[10px] text-[#858585]">
                                <Camera className="size-6 text-[#e9a400]" />
                                Pilih gambar produk
                            </span>
                        )}
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            className="sr-only"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                form.setData('image', file);

                                if (file) {
                                    setPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </label>
                    <InputError
                        message={form.errors.image}
                        className="text-[10px]"
                    />

                    <EditField
                        label="Nama Produk"
                        value={form.data.name}
                        onChange={(value) => form.setData('name', value)}
                        error={form.errors.name}
                    />
                    <EditField
                        label="Jumlah Stok"
                        type="number"
                        min="0"
                        value={String(form.data.stock)}
                        onChange={(value) =>
                            form.setData('stock', Number(value))
                        }
                        error={form.errors.stock}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <EditField
                            label="Harga Beli"
                            type="number"
                            min="0"
                            value={String(form.data.purchase_price)}
                            onChange={(value) =>
                                form.setData('purchase_price', Number(value))
                            }
                            error={form.errors.purchase_price}
                        />
                        <EditField
                            label="Harga Jual"
                            type="number"
                            min="0"
                            value={String(form.data.selling_price)}
                            onChange={(value) =>
                                form.setData('selling_price', Number(value))
                            }
                            error={form.errors.selling_price}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 rounded-[10px] border border-[#dedede] bg-white px-4 text-[11px] font-semibold"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="flex h-10 items-center gap-2 rounded-[10px] bg-[#ffb500] px-4 text-[11px] font-bold text-white disabled:opacity-60"
                        >
                            {form.processing ? (
                                <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Simpan
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditField({
    label,
    value,
    onChange,
    error,
    type = 'text',
    min,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: 'text' | 'number';
    min?: string;
}) {
    return (
        <label className="block text-[10px] font-semibold text-[#4d4d4d]">
            {label}
            <input
                type={type}
                min={min}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 h-10 w-full rounded-[10px] border border-[#e2e2e2] bg-white px-3 text-[12px] font-medium outline-none focus:border-[#f2ad00]"
            />
            <InputError message={error} className="mt-1 text-[10px]" />
        </label>
    );
}

function imageUrl(image: string) {
    return image.startsWith('http') ||
        image.startsWith('/') ||
        image.startsWith('data:')
        ? image
        : `/storage/${image}`;
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
        <div className="mt-3 flex justify-end gap-2 pb-3">
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
