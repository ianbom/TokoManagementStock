import { Head, router, useForm } from '@inertiajs/react';
import { ChevronLeft, Minus, Plus, ScanLine } from 'lucide-react';
import {
    create,
    destroyDraft,
    store,
} from '@/actions/App/Http/Controllers/StockInController';
import { formatRupiah, ProductThumbnail } from './stock-in-data';
import type { StockDraftProduct } from './stock-in-data';

type Props = {
    products: StockDraftProduct[];
};

export default function StockInConfirmation({ products }: Props) {
    const form = useForm({
        items: products.map((product) => ({
            id: product.id,
            quantity: product.quantity,
        })),
    });

    const changeQuantity = (id: string, amount: number) => {
        form.setData(
            'items',
            form.data.items.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item,
            ),
        );
    };

    const quantityFor = (id: string) =>
        form.data.items.find((item) => item.id === id)?.quantity ?? 1;

    return (
        <>
            <Head title="Konfirmasi Barang Masuk" />

            <main className="mx-auto min-h-[1284px] w-full max-w-[393px] overflow-hidden bg-[#fff8e1] px-5 pt-[50px] pb-[66px] text-[#252525]">
                <header className="flex h-12 items-center gap-5">
                    <button
                        type="button"
                        onClick={() => router.delete(destroyDraft().url)}
                        aria-label="Batalkan input stok"
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f8f3de] text-[#707070] transition active:scale-95"
                    >
                        <ChevronLeft className="size-7" strokeWidth={2.5} />
                    </button>
                    <h1 className="text-[16px] leading-5 font-bold">
                        Konfirmasi Barang Masuk
                    </h1>
                </header>

                <section className="mt-10 space-y-[10px]" aria-label="Produk">
                    {products.map((product) => (
                        <article
                            key={product.id}
                            className="h-[177px] rounded-[18px] bg-white p-4"
                        >
                            <div className="flex gap-4">
                                <ProductThumbnail product={product} />

                                <div className="min-w-0 flex-1 pt-[7px]">
                                    <h2 className="truncate text-[16px] leading-5 font-semibold">
                                        {product.name}
                                    </h2>
                                    <div className="mt-[10px] grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[12px] leading-4 text-[#858585]">
                                                Harga Beli
                                            </p>
                                            <p className="text-[14px] leading-[18px] font-bold">
                                                {formatRupiah(
                                                    product.purchase_price,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[12px] leading-4 text-[#858585]">
                                                Harga Jual
                                            </p>
                                            <p className="text-[14px] leading-[18px] font-semibold text-[#ff9f00]">
                                                {formatRupiah(
                                                    product.selling_price,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-[135px_106px_1fr] items-center gap-2">
                                <p className="text-[14px] leading-5 font-medium">
                                    Jumlah Masuk
                                </p>

                                <div className="flex h-[46px] w-[106px] items-center justify-between rounded-[16px] border border-[#e5e5e5] bg-white px-[9px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeQuantity(product.id, -1)
                                        }
                                        aria-label={`Kurangi jumlah ${product.name}`}
                                        className="flex size-7 items-center justify-center rounded-full bg-[#eff9f7] text-[#687878]"
                                    >
                                        <Minus
                                            className="size-4"
                                            strokeWidth={2}
                                        />
                                    </button>
                                    <output className="min-w-6 text-center text-[18px] leading-6 font-medium">
                                        {quantityFor(product.id)}
                                    </output>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeQuantity(product.id, 1)
                                        }
                                        aria-label={`Tambah jumlah ${product.name}`}
                                        className="flex size-7 items-center justify-center rounded-full bg-[#eff9f7] text-[#687878]"
                                    >
                                        <Plus
                                            className="size-4"
                                            strokeWidth={2}
                                        />
                                    </button>
                                </div>

                                <span className="text-right text-[14px] leading-5 text-[#858585]">
                                    pcs
                                </span>
                            </div>
                        </article>
                    ))}
                </section>

                <button
                    type="button"
                    onClick={() => router.visit(create().url)}
                    className="mt-5 flex h-[54px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#fdb900] bg-white text-[15px] font-semibold text-[#d99400]"
                    data-test="scan-product-again"
                >
                    <ScanLine className="size-5" />
                    Scan Produk Lagi
                </button>

                <button
                    type="button"
                    disabled={form.processing}
                    onClick={() => form.post(store().url)}
                    className="mt-5 h-[61px] w-full rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[17px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.12)] transition active:scale-[0.99] disabled:opacity-60"
                    data-test="save-stock-in"
                >
                    {form.processing ? 'Menyimpan...' : 'Simpan'}
                </button>

                <button
                    type="button"
                    onClick={() => router.delete(destroyDraft().url)}
                    className="mt-[29px] block w-full text-center text-[16px] leading-5 font-medium"
                >
                    Batal
                </button>
            </main>
        </>
    );
}
