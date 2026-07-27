import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Camera,
    Image as ImageIcon,
    Info,
    Minus,
    Package,
    Plus,
    Tag,
    WalletCards,
} from 'lucide-react';
import type { ChangeEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import { dashboard } from '@/routes';
import { confirmation } from '@/routes/stocks';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import { formatRupiah, ProductThumbnail, stockProducts } from './stock-in-data';

type StockFieldProps = {
    id: string;
    label: string;
    helper: string;
    icon: ReactNode;
    value: string;
    onChange: (value: string) => void;
    inputMode?: 'text' | 'numeric';
};

function StockField({
    id,
    label,
    helper,
    icon,
    value,
    onChange,
    inputMode = 'text',
}: StockFieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-[10px] leading-3 font-semibold text-[#0e223e]"
            >
                {label}
            </label>
            <div className="relative mt-1">
                <span className="pointer-events-none absolute top-1/2 left-[9px] flex size-4 -translate-y-1/2 items-center justify-center text-[#707070]">
                    {icon}
                </span>
                <input
                    id={id}
                    required
                    inputMode={inputMode}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-[28px] w-full rounded-[8px] border border-[#d8d8d8] bg-white pr-3 pl-[31px] text-[10px] text-[#252525] transition outline-none focus:border-[#fdb900] focus:ring-1 focus:ring-[#fdb900]/25"
                />
            </div>
            <p className="mt-1 text-[8px] leading-[10px] text-[#858585]">
                {helper}
            </p>
        </div>
    );
}

function onlyDigits(value: string) {
    return value.replace(/\D/g, '');
}

function currencyValue(value: string) {
    return value ? formatRupiah(Number(value)) : 'Rp ';
}

export default function InputStock() {
    const cameraInput = useRef<HTMLInputElement>(null);
    const galleryInput = useRef<HTMLInputElement>(null);
    const [name, setName] = useState('Indomie Goreng');
    const [purchasePrice, setPurchasePrice] = useState('3000');
    const [sellingPrice, setSellingPrice] = useState('3500');
    const [quantity, setQuantity] = useState(50);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileError, setFileError] = useState('');

    const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setFileError('Gunakan format JPG atau PNG.');
            event.target.value = '';

            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setFileError('Ukuran foto maksimal 2MB.');
            event.target.value = '';

            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(String(reader.result));
            setFileError('');
        };
        reader.readAsDataURL(file);
    };

    const updatePrice = (setter: (value: string) => void, value: string) =>
        setter(onlyDigits(value));

    return (
        <>
            <Head title="Stock Masuk" />

            <section className="min-h-[625px] bg-[#fff9e8] pb-3">
                <AppPageHeader
                    backgroundImage={heroImage}
                    className="h-[107px] rounded-b-[31px] bg-[position:64%_center] px-[14px] pt-[11px] text-white"
                >
                    <div className="relative flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => router.visit(dashboard().url)}
                            aria-label="Kembali ke dashboard"
                            className="flex size-9 items-center justify-center rounded-[12px] bg-white/20 text-white transition active:scale-95"
                        >
                            <ArrowLeft className="size-5" strokeWidth={2} />
                        </button>

                        <button
                            type="button"
                            aria-label="Buka notifikasi"
                            className="relative flex size-9 items-center justify-center rounded-[12px] bg-white/20"
                        >
                            <Bell
                                className="size-[18px] fill-white text-white"
                                strokeWidth={1.7}
                            />
                            <span className="absolute top-[8px] right-[8px] size-[6px] rounded-full bg-[#e80d18]" />
                        </button>
                    </div>

                    <AppPageHeaderHeading
                        className="relative mt-[11px] ml-[13px]"
                        title="Stock Masuk"
                        description="Tambahkan persediaan barang ke toko Anda"
                        titleClassName="text-[20px] leading-6 font-bold tracking-[-0.3px]"
                        descriptionClassName="mt-[2px] text-[11px] leading-4 text-white/95"
                    />
                </AppPageHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        router.visit(confirmation().url);
                    }}
                    className="relative z-10 mx-[13px] mt-[10px] rounded-[13px] bg-white px-[17px] pt-[14px] pb-[13px] shadow-[0_8px_24px_rgba(246,169,0,0.08)]"
                >
                    <h2 className="text-[14px] leading-[18px] font-bold text-[#0e223e]">
                        Form Input Barang
                    </h2>

                    <div className="mt-[9px] space-y-[6px]">
                        <StockField
                            id="product-name"
                            label="Nama Produk"
                            helper="Gunakan nama produk yang mudah dikenali"
                            icon={<Package className="size-4 fill-[#707070]" />}
                            value={name}
                            onChange={setName}
                        />

                        <StockField
                            id="purchase-price"
                            label="Harga Beli"
                            helper="Contoh: Rp 10.000"
                            icon={<WalletCards className="size-4" />}
                            inputMode="numeric"
                            value={currencyValue(purchasePrice)}
                            onChange={(value) =>
                                updatePrice(setPurchasePrice, value)
                            }
                        />

                        <StockField
                            id="selling-price"
                            label="Harga Jual"
                            helper="Harga jual sebaiknya lebih tinggi dari harga beli"
                            icon={<Tag className="size-4 fill-[#707070]" />}
                            inputMode="numeric"
                            value={currencyValue(sellingPrice)}
                            onChange={(value) =>
                                updatePrice(setSellingPrice, value)
                            }
                        />

                        <div>
                            <label
                                htmlFor="stock-quantity"
                                className="block text-[10px] leading-3 font-semibold text-[#0e223e]"
                            >
                                Jumlah Masuk
                            </label>
                            <div className="relative mt-1 flex h-[28px] items-center rounded-[8px] border border-[#d8d8d8] bg-white pl-[31px]">
                                <Package className="absolute left-[9px] size-4 fill-[#707070] text-[#707070]" />
                                <input
                                    id="stock-quantity"
                                    required
                                    min={1}
                                    inputMode="numeric"
                                    value={`${quantity} pcs`}
                                    onChange={(event) => {
                                        const next = Number(
                                            onlyDigits(event.target.value),
                                        );
                                        setQuantity(Math.max(1, next || 1));
                                    }}
                                    className="min-w-0 flex-1 bg-transparent text-[10px] outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((current) =>
                                            Math.max(1, current - 1),
                                        )
                                    }
                                    aria-label="Kurangi jumlah"
                                    className="mr-1 flex size-[23px] items-center justify-center rounded-[7px] border border-[#e4e4e4] text-[#0e223e]"
                                >
                                    <Minus
                                        className="size-3"
                                        strokeWidth={2.5}
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQuantity((current) => current + 1)
                                    }
                                    aria-label="Tambah jumlah"
                                    className="mr-[5px] flex size-[23px] items-center justify-center rounded-[7px] border border-[#e4e4e4] text-[#0e223e]"
                                >
                                    <Plus
                                        className="size-3"
                                        strokeWidth={2.5}
                                    />
                                </button>
                            </div>
                            <p className="mt-1 text-[8px] leading-[10px] text-[#858585]">
                                Masukkan jumlah barang yang masuk ke toko
                            </p>
                        </div>
                    </div>

                    <div className="mt-[7px]">
                        <p className="text-[10px] leading-3 font-semibold text-[#0e223e]">
                            Foto Produk
                        </p>
                        <div className="mt-1 flex h-[76px] items-center rounded-[9px] border border-dashed border-[#b7b7b7] px-[7px]">
                            <div className="flex h-[61px] w-[78px] shrink-0 items-center justify-center overflow-hidden">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview produk"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <ProductThumbnail
                                        product={stockProducts[1]}
                                    />
                                )}
                            </div>

                            <div className="ml-[10px] min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-[#0e223e]">
                                        <Camera className="size-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-[10px] leading-3 font-medium text-[#0e223e]">
                                            Unggah foto produk
                                        </p>
                                        <p className="mt-1 text-[8px] leading-[10px] text-[#858585]">
                                            Format JPG/PNG, maks. 2MB
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-[6px] grid grid-cols-2 gap-[7px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            cameraInput.current?.click()
                                        }
                                        className="flex h-[24px] items-center justify-center gap-1 rounded-[7px] border border-[#d8d8d8] text-[8px] text-[#0e223e]"
                                    >
                                        <Camera className="size-3" />
                                        Ambil Foto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            galleryInput.current?.click()
                                        }
                                        className="flex h-[24px] items-center justify-center gap-1 rounded-[7px] border border-[#d8d8d8] text-[8px] text-[#0e223e]"
                                    >
                                        <ImageIcon className="size-3" />
                                        Pilih dari Galeri
                                    </button>
                                </div>
                            </div>
                        </div>
                        {fileError && (
                            <p className="mt-1 text-[8px] text-red-600">
                                {fileError}
                            </p>
                        )}
                        <input
                            ref={cameraInput}
                            type="file"
                            accept="image/jpeg,image/png"
                            capture="environment"
                            onChange={selectPhoto}
                            className="sr-only"
                        />
                        <input
                            ref={galleryInput}
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={selectPhoto}
                            className="sr-only"
                        />
                    </div>

                    <div className="mt-[8px] flex h-[58px] items-center rounded-[9px] border border-[#ffdc78] bg-[#fffdf5] px-[8px]">
                        <div className="flex h-[48px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-white">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Produk terpilih"
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <div className="origin-center scale-[0.72]">
                                    <ProductThumbnail
                                        product={stockProducts[1]}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="ml-[10px] min-w-0 flex-1">
                            <p className="truncate text-[11px] leading-[14px] font-bold text-[#0e223e]">
                                {name || 'Nama Produk'}
                            </p>
                            <div className="mt-1 grid grid-cols-[1fr_auto] gap-2 text-[8px] leading-[11px]">
                                <div>
                                    <p>
                                        Harga beli:{' '}
                                        <strong>
                                            {currencyValue(purchasePrice)}
                                        </strong>
                                    </p>
                                    <p>
                                        Harga jual:{' '}
                                        <strong>
                                            {currencyValue(sellingPrice)}
                                        </strong>
                                    </p>
                                </div>
                                <p className="self-center border-l border-[#ffe2a0] pl-3">
                                    Jumlah masuk:{' '}
                                    <strong>{quantity} pcs</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[7px] flex h-[25px] items-center rounded-[8px] border border-[#ffe099] bg-[#fff8df] px-[8px] text-[8px] text-[#4d4d4d]">
                        <Info className="mr-2 size-4 shrink-0 fill-[#f6a900] text-white" />
                        Pastikan data barang sudah sesuai sebelum disimpan
                    </div>

                    <div className="mt-[7px] grid grid-cols-2 gap-[7px]">
                        <button
                            type="button"
                            onClick={() => router.visit(dashboard().url)}
                            className="h-[28px] rounded-[8px] border border-[#0e223e] text-[10px] font-semibold text-[#0e223e]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="h-[28px] rounded-[8px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[10px] font-semibold text-white shadow-[0_5px_12px_rgba(253,185,0,0.18)]"
                            data-test="submit-stock-input"
                        >
                            Simpan Stock
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}
