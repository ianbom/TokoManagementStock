import { Head, Link, router } from '@inertiajs/react';
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    MessageCircleMore,
    Plus,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    AppPageHeader,
    AppPageHeaderHeading,
    AppPageHeaderSearch,
} from '@/components/app-page-header';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    index as chatIndex,
    partners as searchPartners,
    show as chatDetail,
    store as startConversation,
} from '@/routes/chats';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import chatReference from '../../../../Design/Obrolan/Obrolan.png';

type Partner = { id: number; name: string; category: string; address: string };
type Conversation = {
    id: number;
    partner: Partner;
    latest_message: string;
    latest_message_at: string | null;
    unread_count: number;
};
type Paginated<T> = {
    data: T[];
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

const avatarPositions = [
    '-38px -229px',
    '-38px -296px',
    '-38px -360px',
    '-38px -425px',
    '-38px -493px',
];

export default function ListChat({
    conversations,
    filters,
}: {
    conversations: Paginated<Conversation>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const [newConversationOpen, setNewConversationOpen] = useState(false);

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                chatIndex().url,
                { search },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['conversations', 'filters'],
                },
            );
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters.search, search]);

    return (
        <>
            <Head title="Obrolan" />
            <AppPageHeader
                backgroundImage={heroImage}
                className="h-[170px] rounded-b-[29px] bg-[position:65%_center] px-[25px] pt-[47px] text-white"
            >
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
                    <AppPageHeaderHeading
                        title="Obrolan"
                        description="Hubungi supplier dan mitra tokomu"
                        titleClassName="text-[26px] leading-[27px] font-bold tracking-[-0.5px]"
                        descriptionClassName="mt-0.5 text-[15px] leading-5 text-white/95"
                    />
                    <AppPageHeaderSearch
                        aria-label="Cari nama supplier atau isi pesan"
                        placeholder="Cari nama supplier atau isi pesan"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        wrapperClassName="mt-[12px] flex h-[43px] items-center rounded-[16px] bg-white px-4 text-[#333] shadow-[0_3px_12px_rgba(2,20,43,0.05)]"
                        iconClassName="size-[21px] shrink-0"
                        inputClassName="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#858585]"
                        trailing={
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
                        }
                    />
                </div>
            </AppPageHeader>

            <section className="px-[25px] pt-[17px]">
                <div className="flex h-[20px] items-center justify-between px-0.5">
                    <h2 className="text-[16px] leading-5 font-bold tracking-[-0.2px] text-[#252525]">
                        Daftar Obrolan
                    </h2>
                    <span className="rounded-full bg-[#fff0cd] px-2.5 py-1 text-[10px] font-semibold text-[#f29a00]">
                        {conversations.total} Obrolan
                    </span>
                </div>

                <div className="mt-[9px] overflow-hidden rounded-[13px] bg-white px-[14px] shadow-[0_6px_18px_rgba(14,34,62,0.035)]">
                    {conversations.data.length ? (
                        conversations.data.map((conversation, index) => (
                            <ConversationRow
                                key={conversation.id}
                                conversation={conversation}
                                divided={index > 0}
                                avatarPosition={
                                    avatarPositions[
                                        conversation.partner.id %
                                            avatarPositions.length
                                    ]
                                }
                            />
                        ))
                    ) : (
                        <p className="py-8 text-center text-[12px] text-[#858585]">
                            {search
                                ? 'Obrolan tidak ditemukan.'
                                : 'Belum ada obrolan.'}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setNewConversationOpen(true)}
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

                <Pagination
                    previous={conversations.prev_page_url}
                    next={conversations.next_page_url}
                />
            </section>

            <NewConversationDialog
                open={newConversationOpen}
                onOpenChange={setNewConversationOpen}
            />
        </>
    );
}

function NewConversationDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [search, setSearch] = useState('');
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startingPartnerId, setStartingPartnerId] = useState<number | null>(
        null,
    );

    useEffect(() => {
        const term = search.trim();

        if (!open || term.length < 2) {
            return;
        }

        const controller = new AbortController();
        const timeout = window.setTimeout(async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(
                    searchPartners({ query: { search: term } }).url,
                    {
                        headers: { Accept: 'application/json' },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error('Pencarian toko gagal.');
                }

                const data = (await response.json()) as {
                    partners: Partner[];
                };
                setPartners(data.partners);
            } catch (requestError) {
                if (
                    requestError instanceof DOMException &&
                    requestError.name === 'AbortError'
                ) {
                    return;
                }

                setPartners([]);
                setError('Toko gagal dimuat. Silakan coba lagi.');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [open, search]);

    const changeOpen = (nextOpen: boolean) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
            setSearch('');
            setPartners([]);
            setError('');
            setStartingPartnerId(null);
        }
    };

    const selectPartner = (partner: Partner) => {
        router.post(
            startConversation(partner.id).url,
            {},
            {
                onStart: () => setStartingPartnerId(partner.id),
                onError: () => setError('Obrolan gagal dibuka.'),
                onFinish: () => setStartingPartnerId(null),
            },
        );
    };

    const changeSearch = (value: string) => {
        setSearch(value);
        setPartners([]);
        setLoading(false);
        setError('');
    };

    return (
        <Dialog open={open} onOpenChange={changeOpen}>
            <DialogContent className="w-[calc(100%-32px)] max-w-[361px] gap-0 rounded-[22px] border-0 bg-[#fff9e8] p-5 text-[#252525] shadow-[0_18px_50px_rgba(14,34,62,0.24)]">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-[19px] leading-6 font-bold text-[#0e223e]">
                        Mulai Obrolan Baru
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-[11px] leading-4 text-[#858585]">
                        Cari toko, supplier, atau mitra usaha lainnya
                    </DialogDescription>
                </DialogHeader>

                <label className="mt-4 flex h-[43px] items-center rounded-[14px] border border-[#ece2c7] bg-white px-3.5 shadow-[0_4px_12px_rgba(14,34,62,0.04)]">
                    <Search
                        aria-hidden="true"
                        className="size-[19px] shrink-0 text-[#7d7d7d]"
                        strokeWidth={1.9}
                    />
                    <input
                        autoFocus
                        type="search"
                        value={search}
                        onChange={(event) => changeSearch(event.target.value)}
                        placeholder="Masukkan nama toko"
                        aria-label="Cari nama toko"
                        className="min-w-0 flex-1 bg-transparent px-3 text-[12px] text-[#252525] outline-none placeholder:text-[#9b9b9b]"
                    />
                    {loading ? (
                        <LoaderCircle
                            aria-label="Mencari toko"
                            className="size-[18px] animate-spin text-[#f3aa00]"
                        />
                    ) : null}
                </label>

                <div className="mt-3 max-h-[290px] min-h-[116px] overflow-y-auto rounded-[14px] bg-white px-3 shadow-[0_5px_16px_rgba(14,34,62,0.04)]">
                    {search.trim().length < 2 ? (
                        <p className="flex min-h-[116px] items-center justify-center px-5 text-center text-[11px] leading-4 text-[#858585]">
                            Ketik minimal 2 karakter untuk mencari toko.
                        </p>
                    ) : null}

                    {!loading && error ? (
                        <p className="flex min-h-[116px] items-center justify-center px-5 text-center text-[11px] leading-4 text-red-600">
                            {error}
                        </p>
                    ) : null}

                    {!loading &&
                    !error &&
                    search.trim().length >= 2 &&
                    partners.length === 0 ? (
                        <p className="flex min-h-[116px] items-center justify-center px-5 text-center text-[11px] leading-4 text-[#858585]">
                            Toko tidak ditemukan.
                        </p>
                    ) : null}

                    {search.trim().length >= 2 &&
                        !error &&
                        partners.map((partner, index) => (
                            <button
                                key={partner.id}
                                type="button"
                                disabled={startingPartnerId !== null}
                                onClick={() => selectPartner(partner)}
                                className={`grid min-h-[62px] w-full grid-cols-[39px_minmax(0,1fr)_24px] items-center gap-3 text-left disabled:opacity-60 ${index > 0 ? 'border-t border-[#eeeeee]' : ''}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="size-[39px] rounded-full bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${chatReference})`,
                                        backgroundPosition:
                                            avatarPositions[
                                                partner.id %
                                                    avatarPositions.length
                                            ],
                                        backgroundSize: '393px auto',
                                    }}
                                />
                                <span className="min-w-0">
                                    <span className="block truncate text-[11px] leading-4 font-bold text-[#252525]">
                                        {partner.name}
                                    </span>
                                    <span className="block truncate text-[9px] leading-4 text-[#858585]">
                                        {partner.category} · {partner.address}
                                    </span>
                                </span>
                                {startingPartnerId === partner.id ? (
                                    <LoaderCircle className="size-4 animate-spin text-[#f3aa00]" />
                                ) : (
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-4 text-[#f3aa00]"
                                        strokeWidth={2.4}
                                    />
                                )}
                            </button>
                        ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ConversationRow({
    conversation,
    divided,
    avatarPosition,
}: {
    conversation: Conversation;
    divided: boolean;
    avatarPosition: string;
}) {
    return (
        <Link
            href={chatDetail(conversation.id).url}
            prefetch
            className={`grid h-[66px] w-full grid-cols-[46px_minmax(0,1fr)_42px] items-center gap-[15px] text-left ${divided ? 'border-t border-[#e6e6e6]' : ''}`}
        >
            <span
                aria-hidden="true"
                className="size-[46px] rounded-full bg-no-repeat"
                style={{
                    backgroundImage: `url(${chatReference})`,
                    backgroundPosition: avatarPosition,
                    backgroundSize: '393px auto',
                }}
            />
            <span className="min-w-0">
                <span className="block truncate text-[13px] leading-[18px] font-bold tracking-[-0.15px] text-[#252525]">
                    {conversation.partner.name}
                </span>
                <span className="mt-0.5 block truncate text-[10px] leading-4 text-[#858585]">
                    {conversation.latest_message}
                </span>
            </span>
            <span className="flex h-[43px] flex-col items-end justify-between py-0.5">
                <span className="text-[10px] leading-4 whitespace-nowrap text-[#858585]">
                    {formatConversationTime(conversation.latest_message_at)}
                </span>
                {conversation.unread_count > 0 && (
                    <span className="flex size-[18px] items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-[10px] font-medium text-white">
                        {conversation.unread_count}
                    </span>
                )}
            </span>
        </Link>
    );
}

function formatConversationTime(value: string | null) {
    if (!value) {
        return '';
    }

    const date = new Date(value);
    const today = new Date();
    const startToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );
    const days = Math.round(
        (startToday.getTime() - startDate.getTime()) / 86400000,
    );

    if (days === 0) {
        return new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
            .format(date)
            .replace(':', '.');
    }

    if (days === 1) {
        return 'Kemarin';
    }

    if (days < 7) {
        return new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(
            date,
        );
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
    }).format(date);
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
