import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Camera,
    CheckCheck,
    LoaderCircle,
    MoreVertical,
    Paperclip,
    Send,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AppContent } from '@/components/app-content';
import { AppPageHeader } from '@/components/app-page-header';
import { index as chatList } from '@/routes/chats';
import { store as sendMessage } from '@/routes/chats/messages';
import chatReference from '../../../../Design/Obrolan/Obrolan.png';

type Partner = { id: number; name: string; category: string; address: string };
type Message = {
    id: number;
    message: string | null;
    media_type: 'image' | 'video' | null;
    media_url: string | null;
    sent_by_me: boolean;
    read_at: string | null;
    created_at: string | null;
};

const avatarPositions = [
    '-38px -229px',
    '-38px -296px',
    '-38px -360px',
    '-38px -425px',
    '-38px -493px',
];

export default function Chat({
    conversation,
    partner,
    messages,
}: {
    conversation: { id: number };
    partner: Partner;
    messages: Message[];
}) {
    const form = useForm<{ message: string; media: File | null }>({
        message: '',
        media: null,
    });
    const fileInput = useRef<HTMLInputElement>(null);
    const messagesEnd = useRef<HTMLDivElement>(null);
    const avatarStyle = {
        backgroundImage: `url(${chatReference})`,
        backgroundPosition:
            avatarPositions[partner.id % avatarPositions.length],
        backgroundSize: '393px auto',
    };

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ block: 'end' });
    }, [messages.length]);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.data.message.trim() && form.data.media === null) {
            return;
        }

        form.post(sendMessage(conversation.id).url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();

                if (fileInput.current) {
                    fileInput.current.value = '';
                }
            },
        });
    };

    const removeMedia = () => {
        form.setData('media', null);

        if (fileInput.current) {
            fileInput.current.value = '';
        }
    };

    const error = form.errors.media ?? form.errors.message;

    return (
        <>
            <Head title={partner.name} />
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
                                {partner.name}
                            </h1>
                            <p className="truncate text-[10px] leading-3 text-[#6e6e6e]">
                                {partner.category}
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
                    {messages.length ? (
                        <div className="space-y-[6px]">
                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    avatarStyle={avatarStyle}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-[10px] bg-white px-4 py-8 text-center text-[11px] text-[#858585] shadow-[0_2px_8px_rgba(14,34,62,0.05)]">
                            Belum ada pesan pada obrolan ini.
                        </p>
                    )}
                    <div ref={messagesEnd} />
                </main>

                <form
                    className="fixed right-0 bottom-0 left-1/2 z-40 flex h-[57px] w-full max-w-[393px] -translate-x-1/2 items-center gap-2 bg-white px-[10px] pb-[7px] shadow-[0_-4px_14px_rgba(14,34,62,0.08)]"
                    onSubmit={submit}
                >
                    {form.data.media ? (
                        <SelectedMediaPreview
                            key={`${form.data.media.name}-${form.data.media.lastModified}`}
                            file={form.data.media}
                            onRemove={removeMedia}
                        />
                    ) : null}

                    {error ? (
                        <p
                            className={`absolute right-2 left-2 rounded-[8px] bg-red-50 px-3 py-1.5 text-[9px] text-red-600 shadow-sm ${form.data.media ? 'bottom-[137px]' : 'bottom-[61px]'}`}
                        >
                            {error}
                        </p>
                    ) : null}

                    <input
                        ref={fileInput}
                        hidden
                        type="file"
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                        onChange={(event) =>
                            form.setData(
                                'media',
                                event.target.files?.[0] ?? null,
                            )
                        }
                    />
                    <button
                        type="button"
                        onClick={() => fileInput.current?.click()}
                        aria-label="Lampirkan foto atau video"
                        className="flex size-[36px] shrink-0 items-center justify-center rounded-[11px] border border-[#e1e1e1] bg-white text-[#696969]"
                    >
                        <Paperclip
                            aria-hidden="true"
                            className="size-[19px]"
                            strokeWidth={2}
                        />
                    </button>
                    <div className="flex h-[36px] min-w-0 flex-1 items-center rounded-[11px] border border-[#e1e1e1] bg-white px-3">
                        <input
                            value={form.data.message}
                            onChange={(event) =>
                                form.setData('message', event.target.value)
                            }
                            aria-label="Tulis pesan"
                            placeholder="Tulis pesan..."
                            maxLength={5000}
                            autoComplete="off"
                            className="min-w-0 flex-1 bg-transparent text-[11px] text-[#252525] outline-none placeholder:text-[#9a9a9a]"
                        />
                        <button
                            type="button"
                            onClick={() => fileInput.current?.click()}
                            aria-label="Pilih foto atau video"
                            className="flex size-7 shrink-0 items-center justify-center text-[#696969]"
                        >
                            <Camera
                                aria-hidden="true"
                                className="size-[17px] fill-[#696969] text-[#696969]"
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>
                    <button
                        disabled={
                            form.processing ||
                            (!form.data.message.trim() &&
                                form.data.media === null)
                        }
                        type="submit"
                        aria-label="Kirim pesan"
                        className="flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[linear-gradient(145deg,#ffb500_0%,#ffc619_100%)] text-white shadow-[0_4px_9px_rgba(253,185,0,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {form.processing ? (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-[18px] animate-spin"
                            />
                        ) : (
                            <Send
                                aria-hidden="true"
                                className="size-[19px] fill-white"
                                strokeWidth={2}
                            />
                        )}
                    </button>
                </form>
            </AppContent>
        </>
    );
}

function SelectedMediaPreview({
    file,
    onRemove,
}: {
    file: File;
    onRemove: () => void;
}) {
    const [url] = useState(() => URL.createObjectURL(file));
    const isImage = file.type.startsWith('image/');

    useEffect(() => () => URL.revokeObjectURL(url), [url]);

    return (
        <div className="absolute right-2 bottom-[61px] left-2 flex min-h-[70px] items-center gap-3 rounded-[12px] border border-[#eadfbe] bg-[#fff9e8] p-2 shadow-[0_-4px_14px_rgba(14,34,62,0.08)]">
            {isImage ? (
                <img
                    src={url}
                    alt="Preview lampiran"
                    className="size-[54px] shrink-0 rounded-[9px] object-cover"
                />
            ) : (
                <video
                    src={url}
                    className="h-[54px] w-[76px] shrink-0 rounded-[9px] bg-black object-cover"
                    muted
                />
            )}
            <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-semibold text-[#252525]">
                    {file.name}
                </span>
                <span className="mt-0.5 block text-[9px] text-[#858585]">
                    {formatFileSize(file.size)}
                </span>
            </span>
            <button
                type="button"
                onClick={onRemove}
                aria-label="Hapus lampiran"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[#646464]"
            >
                <X aria-hidden="true" className="size-4" />
            </button>
        </div>
    );
}

function MessageBubble({
    message,
    avatarStyle,
}: {
    message: Message;
    avatarStyle: React.CSSProperties;
}) {
    const time = message.created_at
        ? new Intl.DateTimeFormat('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
          })
              .format(new Date(message.created_at))
              .replace(':', '.')
        : '';

    const content = (
        <>
            <MessageMedia message={message} />
            {message.message ? (
                <p
                    className={`text-[10px] leading-[13px] whitespace-pre-wrap ${message.sent_by_me ? 'text-[#3b3423]' : 'text-[#323232]'} ${message.media_url ? 'mt-1.5' : ''}`}
                >
                    {message.message}
                </p>
            ) : null}
            <p
                className={`mt-0.5 flex items-center justify-end gap-1 text-[7px] leading-3 ${message.sent_by_me ? 'text-[#9a7e26]' : 'text-[#9a9a9a]'}`}
            >
                {time}
                {message.sent_by_me ? (
                    <CheckCheck
                        aria-hidden="true"
                        className="size-[11px]"
                        strokeWidth={2.2}
                    />
                ) : null}
            </p>
        </>
    );

    if (message.sent_by_me) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[235px] rounded-[10px] bg-[#ffdf7b] px-[8px] pt-[6px] pb-[4px] shadow-[0_2px_8px_rgba(253,185,0,0.12)]">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-[7px]">
            <span
                aria-hidden="true"
                className="mb-[2px] size-[27px] shrink-0 rounded-full bg-no-repeat"
                style={avatarStyle}
            />
            <div className="max-w-[210px] rounded-[10px] bg-white px-[8px] pt-[6px] pb-[4px] shadow-[0_2px_8px_rgba(14,34,62,0.05)]">
                {content}
            </div>
        </div>
    );
}

function MessageMedia({ message }: { message: Message }) {
    if (!message.media_url || !message.media_type) {
        return null;
    }

    if (message.media_type === 'image') {
        return (
            <img
                src={message.media_url}
                alt="Media pesan"
                loading="lazy"
                className="max-h-[260px] w-full rounded-[8px] object-cover"
            />
        );
    }

    return (
        <video
            src={message.media_url}
            controls
            preload="metadata"
            className="max-h-[260px] w-full rounded-[8px] bg-black"
        />
    );
}

function formatFileSize(bytes: number): string {
    return bytes < 1024 * 1024
        ? `${Math.ceil(bytes / 1024)} KB`
        : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
