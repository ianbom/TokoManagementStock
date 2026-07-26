import { Head, router } from '@inertiajs/react';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import { notification } from '@/routes/stocks';
import { formatRupiah, ProductThumbnail, stockProducts } from './stock-in-data';

export default function StockInConfirmation() {
    const [quantities, setQuantities] = useState<Record<string, number>>(
        Object.fromEntries(
            stockProducts.map((product) => [
                product.key,
                product.defaultQuantity,
            ]),
        ),
    );

    const changeQuantity = (key: string, amount: number) => {
        setQuantities((current) => ({
            ...current,
            [key]: Math.max(1, current[key] + amount),
        }));
    };

    const goToDashboard = () => router.visit(dashboard().url);

    const save = () => {
        router.visit(
            notification({
                query: quantities,
            }).url,
        );
    };

    return (
        <>
            <Head title="Konfirmasi Barang Masuk" />

            <main className="mx-auto min-h-[1284px] w-full max-w-[393px] overflow-hidden bg-[#fff8e1] px-5 pt-[50px] pb-[66px] text-[#252525]">
                <header className="flex h-12 items-center gap-5">
                    <button
                        type="button"
                        onClick={goToDashboard}
                        aria-label="Kembali ke dashboard"
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f8f3de] text-[#707070] transition active:scale-95"
                    >
                        <ChevronLeft className="size-7" strokeWidth={2.5} />
                    </button>
                    <h1 className="text-[16px] leading-5 font-bold">
                        Konfirmasi Barang Masuk
                    </h1>
                </header>

                <section className="mt-10 space-y-[10px]" aria-label="Produk">
                    {stockProducts.map((product) => (
                        <article
                            key={product.key}
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
                                                    product.purchasePrice,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[12px] leading-4 text-[#858585]">
                                                Harga Jual
                                            </p>
                                            <p className="text-[14px] leading-[18px] font-semibold text-[#ff9f00]">
                                                {formatRupiah(
                                                    product.sellingPrice,
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
                                            changeQuantity(product.key, -1)
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
                                        {quantities[product.key]}
                                    </output>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeQuantity(product.key, 1)
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
                    onClick={save}
                    className="mt-10 h-[61px] w-full rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[17px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.12)] transition active:scale-[0.99]"
                    data-test="save-stock-in"
                >
                    Simpan
                </button>

                <button
                    type="button"
                    onClick={goToDashboard}
                    className="mt-[29px] block w-full text-center text-[16px] leading-5 font-medium"
                >
                    Batal
                </button>
            </main>
        </>
    );
}
