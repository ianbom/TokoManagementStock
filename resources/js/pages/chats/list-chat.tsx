import { Head } from '@inertiajs/react';
import {
    Bell,
    ChevronRight,
    ImageIcon,
    MessageCircleMore,
    Plus,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import chatReference from '../../../../Design/Obrolan/Obrolan.png';

type Conversation = {
    name: string;
    preview: string;
    time: string;
    unread?: number;
    photo?: boolean;
    avatarPosition: string;
};

const conversations: Conversation[] = [
    {
        name: 'Lumintu Grosir KTT',
        preview: 'Stok minyak goreng sudah tersedia, Pak.',
        time: '10.24',
        unread: 2,
        avatarPosition: '-38px -229px',
    },
    {
        name: 'Rahayu Grosir',
        preview: 'Baik, pesanan akan kami proses.',
        time: 'Kemarin',
        avatarPosition: '-38px -296px',
    },
    {
        name: 'Kevin Frozen Food',
        preview: 'Ada tambahan stok nugget minggu ini.',
        time: 'Kemarin',
        unread: 1,
        avatarPosition: '-38px -360px',
    },
    {
        name: 'Sumber Makmur',
        preview: 'Terima kasih sudah melakukan pemesanan.',
        time: 'Sen',
        avatarPosition: '-38px -425px',
    },
    {
        name: 'Mitra Sembako Surabaya',
        preview: 'Foto',
        time: '20 Jul',
        photo: true,
        avatarPosition: '-38px -493px',
    },
];

export default function ListChat() {
    return (
        <>
            <Head title="Obrolan" />

            <header
                className="relative h-[170px] overflow-hidden rounded-b-[29px] bg-cover bg-[position:65%_center] px-[25px] pt-[47px] text-white"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-[rgba(8,31,58,0.84)]" />

                <button
                    type="button"
                    aria-label="Buka notifikasi"
                    className="absolute top-[27px] right-[27px] z-10 flex size-[39px] items-center justify-center rounded-full bg-white/20 backdrop-blur-[2px]"
                >
                    <Bell
                        aria-hidden="true"
                        className="size-[21px] fill-white text-white"
                        strokeWidth={1.7}
                    />
                    <span className="absolute top-[8px] right-[8px] size-[7px] rounded-full bg-[#ed1717] ring-1 ring-[#68778a]" />
                </button>

                <div className="relative">
                    <h1 className="text-[26px] leading-[27px] font-bold tracking-[-0.5px]">
                        Obrolan
                    </h1>
                    <p className="mt-0.5 text-[15px] leading-5 text-white/95">
                        Hubungi supplier dan mitra tokomu
                    </p>

                    <div className="mt-[12px] flex h-[43px] items-center rounded-[16px] bg-white px-4 text-[#333] shadow-[0_3px_12px_rgba(2,20,43,0.05)]">
                        <Search
                            aria-hidden="true"
                            className="size-[21px] shrink-0"
                            strokeWidth={1.8}
                        />
                        <input
                            type="search"
                            readOnly
                            aria-label="Cari nama supplier atau pengguna"
                            placeholder="Cari nama supplier atau pengguna"
                            className="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#858585]"
                        />
                        <button
                            type="button"
                            aria-label="Filter obrolan"
                            className="flex size-8 items-center justify-center"
                        >
                            <SlidersHorizontal
                                aria-hidden="true"
                                className="size-[19px]"
                                strokeWidth={1.9}
                            />
                        </button>
                    </div>
                </div>
            </header>

            <section className="px-[25px] pt-[17px]">
                <div className="flex h-[20px] items-center justify-between px-0.5">
                    <h2 className="text-[16px] leading-5 font-bold tracking-[-0.2px] text-[#252525]">
                        Riwayat Obrolan
                    </h2>
                    <button
                        type="button"
                        className="flex items-center gap-1 text-[12px] font-medium text-[#f2a000]"
                    >
                        Lihat Semua
                        <ChevronRight
                            aria-hidden="true"
                            className="size-4"
                            strokeWidth={2.3}
                        />
                    </button>
                </div>

                <div className="mt-[9px] overflow-hidden rounded-[13px] bg-white px-[14px] shadow-[0_6px_18px_rgba(14,34,62,0.035)]">
                    {conversations.map((conversation, index) => (
                        <ConversationRow
                            key={conversation.name}
                            conversation={conversation}
                            divided={index > 0}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="mt-[10px] flex h-[61px] w-full items-center rounded-[13px] bg-white px-[14px] text-left shadow-[0_6px_18px_rgba(14,34,62,0.035)]"
                >
                    <span className="flex size-[43px] shrink-0 items-center justify-center rounded-[11px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white">
                        <span className="relative flex size-7 items-center justify-center rounded-full bg-white text-[#f5aa00]">
                            <MessageCircleMore
                                aria-hidden="true"
                                className="size-[23px] fill-white"
                                strokeWidth={1.8}
                            />
                            <Plus
                                aria-hidden="true"
                                className="absolute size-[13px]"
                                strokeWidth={3}
                            />
                        </span>
                    </span>
                    <span className="ml-4 min-w-0 flex-1">
                        <span className="block text-[13px] leading-5 font-bold text-[#252525]">
                            Mulai Obrolan Baru
                        </span>
                        <span className="block truncate text-[10px] leading-4 text-[#858585]">
                            Temukan supplier atau mitra usaha lainnya
                        </span>
                    </span>
                    <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white">
                        <ChevronRight
                            aria-hidden="true"
                            className="size-5"
                            strokeWidth={2.8}
                        />
                    </span>
                </button>
            </section>
        </>
    );
}

function ConversationRow({
    conversation,
    divided,
}: {
    conversation: Conversation;
    divided: boolean;
}) {
    return (
        <button
            type="button"
            className={`grid h-[66px] w-full grid-cols-[46px_minmax(0,1fr)_42px] items-center gap-[15px] text-left ${divided ? 'border-t border-[#e6e6e6]' : ''}`}
        >
            <span
                aria-hidden="true"
                className="size-[46px] rounded-full bg-no-repeat"
                style={{
                    backgroundImage: `url(${chatReference})`,
                    backgroundPosition: conversation.avatarPosition,
                    backgroundSize: '393px auto',
                }}
            />
            <span className="min-w-0">
                <span className="block truncate text-[13px] leading-[18px] font-bold tracking-[-0.15px] text-[#252525]">
                    {conversation.name}
                </span>
                <span className="mt-0.5 flex min-w-0 items-center gap-2 text-[10px] leading-4 text-[#858585]">
                    {conversation.photo && (
                        <ImageIcon
                            aria-hidden="true"
                            className="size-[13px] shrink-0 fill-[#858585] text-white"
                            strokeWidth={1.7}
                        />
                    )}
                    <span className="truncate">{conversation.preview}</span>
                </span>
            </span>
            <span className="flex h-[43px] flex-col items-end justify-between py-0.5">
                <span className="text-[10px] leading-4 whitespace-nowrap text-[#858585]">
                    {conversation.time}
                </span>
                {conversation.unread && (
                    <span className="flex size-[18px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[10px] font-medium text-white">
                        {conversation.unread}
                    </span>
                )}
            </span>
        </button>
    );
}
