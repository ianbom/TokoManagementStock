import { Head, router, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    ProductThumbnail,
    quantityFromUrl,
    stockProducts,
} from './stock-in-data';

function SuccessStoreIcon() {
    return (
        <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="size-16 text-[#08bfa5]"
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M11 27h32v26a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5V27Zm14 5v16h13V32H25Z"
                clipRule="evenodd"
            />
            <path
                fill="currentColor"
                d="M16 8h32c2 0 3.6 1.1 4.5 2.9l6.8 13.6c1.2 2.5-.6 5.5-3.4 5.5H8.1c-2.8 0-4.6-3-3.4-5.5l6.8-13.6A5 5 0 0 1 16 8Z"
            />
            <rect
                x="47"
                y="27"
                width="8"
                height="31"
                rx="4"
                fill="currentColor"
            />
        </svg>
    );
}

export default function StockInNotification() {
    const { url } = usePage();

    return (
        <>
            <Head title="Barang Berhasil Ditambahkan" />

            <main className="mx-auto min-h-[1087px] w-full max-w-[393px] overflow-hidden bg-[#fff8e1] px-5 pt-[50px] pb-[49px] text-[#252525]">
                <div className="mx-auto flex size-32 items-center justify-center rounded-full bg-[#f2f8e6]">
                    <SuccessStoreIcon />
                </div>

                <div className="mt-[42px] text-center">
                    <h1 className="text-[40px] leading-[48px] font-bold tracking-[-1px]">
                        Berhasil!
                    </h1>
                    <p className="mx-auto mt-[-1px] max-w-[310px] text-[16px] leading-[21px] text-[#777777]">
                        Barang berhasil ditambahkan ke inventori Anda.
                    </p>
                </div>

                <section
                    className="mt-[38px] space-y-[10px]"
                    aria-label="Stok produk"
                >
                    {stockProducts.map((product) => {
                        const quantity = quantityFromUrl(url, product);

                        return (
                            <article
                                key={product.key}
                                className="flex h-[110px] items-center rounded-[18px] bg-white p-4"
                            >
                                <ProductThumbnail product={product} />

                                <div className="ml-4 min-w-0 flex-1">
                                    <h2 className="truncate text-[16px] leading-5 font-semibold">
                                        {product.name}
                                    </h2>
                                    <p className="mt-[6px] text-[12px] leading-4 text-[#858585]">
                                        Stok Tersedia
                                    </p>
                                </div>

                                <div className="ml-3 w-12 shrink-0 text-right">
                                    <p className="text-[19px] leading-6 font-medium text-[#ff9f00]">
                                        {product.initialStock + quantity}
                                    </p>
                                    <p className="text-[12px] leading-4 text-[#858585]">
                                        Pcs
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <button
                    type="button"
                    onClick={() => router.visit(dashboard().url)}
                    className="mt-10 h-[61px] w-full rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[17px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.12)] transition active:scale-[0.99]"
                    data-test="finish-stock-in"
                >
                    Selesai
                </button>
            </main>
        </>
    );
}
