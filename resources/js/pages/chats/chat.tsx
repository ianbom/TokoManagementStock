import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Camera,
    CheckCheck,
    MoreVertical,
    Paperclip,
    Send,
} from 'lucide-react';
import { AppContent } from '@/components/app-content';
import { AppPageHeader } from '@/components/app-page-header';
import { index as chatList } from '@/routes/chats';
import detailReference from '../../../../Design/Obrolan/Detail-chat.png';
import chatReference from '../../../../Design/Obrolan/Obrolan.png';

const avatarStyle = {
    backgroundImage: `url(${chatReference})`,
    backgroundPosition: '-38px -229px',
    backgroundSize: '393px auto',
};

export default function Chat() {
    return (
        <>
            <Head title="Lumintu Grosir KTT" />

            <AppContent className="min-h-[100dvh] bg-[#fff9e8] pb-0">
                <AppPageHeader className="sticky top-0 z-30 h-[68px] bg-[#fff9e8] px-3 shadow-[0_3px_12px_rgba(14,34,62,0.04)]">
                    <div className="flex h-full items-center gap-3">
                        <Link
                            href={chatList().url}
                            aria-label="Kembali ke daftar obrolan"
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#252525] transition active:scale-95"
                        >
                            <ArrowLeft
                                aria-hidden="true"
                                className="size-[22px]"
                                strokeWidth={2.2}
                            />
                        </Link>

                        <span
                            aria-hidden="true"
                            className="size-10 shrink-0 rounded-full bg-no-repeat"
                            style={avatarStyle}
                        />

                        <div className="min-w-0 flex-1">
                            <h1 className="truncate text-[14px] leading-5 font-bold text-[#252525]">
                                Lumintu Grosir KTT
                            </h1>
                            <p className="text-[10px] leading-3 text-[#6e6e6e]">
                                Online
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Buka menu obrolan"
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#4a4a4a]"
                        >
                            <MoreVertical
                                aria-hidden="true"
                                className="size-5"
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                </AppPageHeader>

                <main
                    className="px-[10px] pt-[10px] pb-[82px]"
                    aria-label="Isi percakapan"
                >
                    <div className="space-y-[6px]">
                        <IncomingMessage time="09.12">
                            Halo Pak, stok minyak goreng sudah tersedia.
                        </IncomingMessage>
                        <OutgoingMessage time="09.13">
                            Baik, saya ingin lihat fotonya dulu.
                        </OutgoingMessage>
                        <IncomingImageMessage
                            image="oil"
                            time="09.15"
                            caption="Ini stok minyak goreng yang tersedia hari ini"
                        />
                        <IncomingMessage time="09.16">
                            Harga per pcs Rp 18.000
                        </IncomingMessage>
                        <OutgoingMessage time="09.18">
                            Baik, saya pesan 10 pcs.
                        </OutgoingMessage>
                        <OutgoingMessage time="09.18">
                            Apakah ada stok beras Ramos juga?
                        </OutgoingMessage>
                        <IncomingImageMessage
                            image="rice"
                            time="09.20"
                            caption="Ada juga beras Ramos 5kg"
                        />
                        <IncomingMessage time="09.21">
                            Tersedia 12 karung, Pak.
                        </IncomingMessage>
                        <OutgoingMessage time="09.22">
                            Baik, nanti saya konfirmasi pesanannya.
                        </OutgoingMessage>
                    </div>
                </main>

                <form
                    className="fixed right-0 bottom-0 left-1/2 z-40 flex h-[57px] w-full max-w-[393px] -translate-x-1/2 items-center gap-2 bg-white px-[10px] pb-[7px] shadow-[0_-4px_14px_rgba(14,34,62,0.08)]"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <button
                        type="button"
                        aria-label="Lampirkan file"
                        className="flex size-[36px] shrink-0 items-center justify-center rounded-[11px] border border-[#e1e1e1] bg-white text-[#6d6d6d]"
                    >
                        <Paperclip
                            aria-hidden="true"
                            className="size-[19px]"
                            strokeWidth={2}
                        />
                    </button>
                    <div className="flex h-[36px] min-w-0 flex-1 items-center rounded-[11px] border border-[#e1e1e1] bg-white px-3">
                        <input
                            readOnly
                            aria-label="Tulis pesan"
                            placeholder="Tulis pesan..."
                            className="min-w-0 flex-1 bg-transparent text-[11px] text-[#252525] outline-none placeholder:text-[#9a9a9a]"
                        />
                        <button
                            type="button"
                            aria-label="Buka kamera"
                            className="flex size-7 shrink-0 items-center justify-center text-[#737373]"
                        >
                            <Camera
                                aria-hidden="true"
                                className="size-[17px] fill-[#737373] text-[#737373]"
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>
                    <button
                        type="submit"
                        aria-label="Kirim pesan"
                        className="flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white shadow-[0_4px_9px_rgba(253,185,0,0.22)]"
                    >
                        <Send
                            aria-hidden="true"
                            className="size-[19px] fill-white"
                            strokeWidth={2}
                        />
                    </button>
                </form>
            </AppContent>
        </>
    );
}

function IncomingMessage({
    children,
    time,
}: {
    children: React.ReactNode;
    time: string;
}) {
    return (
        <div className="flex items-end gap-[7px]">
            <span
                aria-hidden="true"
                className="mb-[2px] size-[27px] shrink-0 rounded-full bg-no-repeat"
                style={avatarStyle}
            />
            <div className="max-w-[190px] rounded-[10px] bg-white px-[8px] pt-[6px] pb-[4px] shadow-[0_2px_8px_rgba(14,34,62,0.05)]">
                <p className="text-[10px] leading-[13px] text-[#323232]">
                    {children}
                </p>
                <p className="mt-0.5 text-right text-[7px] leading-3 text-[#9a9a9a]">
                    {time}
                </p>
            </div>
        </div>
    );
}

function OutgoingMessage({
    children,
    time,
}: {
    children: React.ReactNode;
    time: string;
}) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[215px] rounded-[10px] bg-[#ffdf7b] px-[9px] pt-[6px] pb-[4px] shadow-[0_2px_8px_rgba(253,185,0,0.12)]">
                <p className="text-[10px] leading-[13px] text-[#3b3423]">
                    {children}
                </p>
                <p className="mt-0.5 flex items-center justify-end gap-1 text-[7px] leading-3 text-[#9a7e26]">
                    {time}
                    <CheckCheck
                        aria-hidden="true"
                        className="size-[11px]"
                        strokeWidth={2.2}
                    />
                </p>
            </div>
        </div>
    );
}

function IncomingImageMessage({
    image,
    time,
    caption,
}: {
    image: 'oil' | 'rice';
    time: string;
    caption: string;
}) {
    const imageStyle =
        image === 'oil'
            ? {
                  backgroundPosition: '-49px -94px',
                  height: '124px',
              }
            : {
                  backgroundPosition: '-49px -313px',
                  height: '108px',
              };

    return (
        <div className="flex items-end gap-[7px]">
            <span
                aria-hidden="true"
                className="mb-[2px] size-[27px] shrink-0 rounded-full bg-no-repeat"
                style={avatarStyle}
            />
            <div className="w-[190px] overflow-hidden rounded-[10px] bg-white p-[4px] shadow-[0_2px_8px_rgba(14,34,62,0.05)]">
                <div
                    aria-hidden="true"
                    className="w-[182px] rounded-[7px] bg-no-repeat"
                    style={{
                        backgroundImage: `url(${detailReference})`,
                        backgroundSize: '350px 543px',
                        ...imageStyle,
                    }}
                />
                <p className="px-[4px] pt-[4px] text-[10px] leading-[12px] text-[#323232]">
                    {caption}
                </p>
                <p className="px-[4px] pt-0.5 text-right text-[7px] leading-3 text-[#9a9a9a]">
                    {time}
                </p>
            </div>
        </div>
    );
}
