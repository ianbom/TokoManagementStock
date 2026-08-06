import { Form, Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    HelpCircle,
    Info,
    LogOut,
    Phone,
    UserRound,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import {
    AppPageHeader,
    AppPageHeaderHeading,
} from '@/components/app-page-header';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard, logout } from '@/routes';
import type { Auth } from '@/types';
import heroImage from '../../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';

type BusinessProfile = {
    name: string;
    owner_name: string;
    address: string;
    phone: string | null;
    business_category: string | null;
};

type PageProps = {
    auth: Auth;
    business?: BusinessProfile | null;
    passwordRules?: string;
};

const inputClass =
    'h-[42px] w-full rounded-[10px] border border-[#d5d5d5] bg-white px-[12px] text-[13px] text-[#0e223e] outline-none transition focus:border-[#fdb900] focus:ring-1 focus:ring-[#fdb900]/25';

export default function Profile() {
    const { auth, business, passwordRules } = usePage<PageProps>().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(auth.user.photo_url);
    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const userForm = useForm({
        _method: 'patch',
        name: auth.user.name,
        photo_url: null as File | null,
        password: '',
        password_confirmation: '',
        current_password: '',
    });

    const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
        const photo = event.target.files?.[0] ?? null;

        userForm.setData('photo_url', photo);
        setPhotoPreview(
            photo === null ? auth.user.photo_url : URL.createObjectURL(photo),
        );
    };
    const businessForm = useForm({
        business_category: business?.business_category ?? 'Toko Kelontong',
        name: business?.name ?? 'Toko Ketintang Mart',
        owner_name: business?.owner_name ?? auth.user.name,
        phone: business?.phone ?? '0812 3456 7890',
        address:
            business?.address ?? 'Jl. Ketintang Baru Selatan No. 7, Surabaya',
    });

    const submitUser = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (userForm.data.password && !userForm.data.current_password) {
            setPasswordDialogOpen(true);

            return;
        }

        userForm.post(ProfileController.update.url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                userForm.reset(
                    'photo_url',
                    'password',
                    'password_confirmation',
                    'current_password',
                );
                setPhotoPreview((page.props as PageProps).auth.user.photo_url);
                setPasswordDialogOpen(false);
            },
        });
    };

    const submitBusiness = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        businessForm.patch(ProfileController.updateBusiness.url(), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Pengaturan" />

            <div className="min-h-[821px] bg-[#fff9e8] pb-[66px] text-[#0e223e]">
                <AppPageHeader
                    backgroundImage={heroImage}
                    overlayClassName="bg-[rgba(8,31,58,0.86)]"
                    className="h-[107px] rounded-b-[31px] bg-[position:66%_center] px-[18px] pt-[11px] text-white"
                >
                    <div className="relative flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => router.visit(dashboard().url)}
                            aria-label="Kembali ke dashboard"
                            className="flex size-[31px] items-center justify-center rounded-full border border-white/55 bg-white/8 transition active:scale-95"
                        >
                            <ArrowLeft
                                className="size-[17px]"
                                strokeWidth={2}
                            />
                        </button>
                        <button
                            type="button"
                            aria-label="Buka notifikasi"
                            className="relative flex size-[31px] items-center justify-center rounded-full border border-white/55 bg-white/8"
                        >
                            <Bell
                                className="size-[16px] fill-white text-white"
                                strokeWidth={1.7}
                            />
                            <span className="absolute top-[6px] right-[6px] size-[5px] rounded-full bg-[#e80d18]" />
                        </button>
                    </div>

                    <AppPageHeaderHeading
                        className="relative mt-[13px]"
                        title="Pengaturan"
                        description="Kelola data akun dan toko Anda"
                        titleClassName="text-[19px] leading-6 font-bold tracking-[-0.3px]"
                        descriptionClassName="mt-[2px] text-[11px] leading-4 text-white/95"
                    />
                </AppPageHeader>

                <section className="px-4 pt-[18px]">
                    <h2 className="text-[16px] leading-5 font-semibold">
                        Data Pengguna
                    </h2>
                    <form onSubmit={submitUser} className="mt-2">
                        <div className="space-y-3 rounded-[14px] bg-white px-4 py-[14px] shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                            <div>
                                <p className="text-[12px] leading-4 font-medium text-[#151515]">
                                    Foto Profil
                                </p>
                                <div className="mt-2 flex items-center gap-3">
                                    <Avatar className="size-14 border border-[#e1e1e1]">
                                        <AvatarImage
                                            src={photoPreview ?? undefined}
                                            alt={`Foto profil ${auth.user.name}`}
                                        />
                                        <AvatarFallback className="bg-[#fff4cf] text-[13px] font-semibold text-[#0e223e]">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="photo_url"
                                        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[9px] border border-[#d5d5d5] px-3 text-[11px] font-medium text-[#0e223e] transition hover:bg-[#fff9e8]"
                                    >
                                        <UserRound className="size-3.5" />
                                        Pilih Foto
                                        <input
                                            id="photo_url"
                                            name="photo_url"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={selectPhoto}
                                            className="sr-only"
                                        />
                                    </label>
                                </div>
                                <p className="mt-1 text-[10px] text-[#858585]">
                                    JPG, PNG, atau WebP. Maksimal 2 MB.
                                </p>
                                <InputError
                                    className="mt-1 text-[11px]"
                                    message={userForm.errors.photo_url}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-[12px] leading-4 font-medium text-[#151515]"
                                >
                                    Nama
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    required
                                    autoComplete="name"
                                    value={userForm.data.name}
                                    onChange={(event) =>
                                        userForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    className={`${inputClass} mt-1`}
                                />
                                <InputError
                                    className="mt-1 text-[11px]"
                                    message={userForm.errors.name}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[12px] leading-4 font-medium text-[#151515]"
                                >
                                    Password Baru
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        autoComplete="new-password"
                                        value={userForm.data.password}
                                        onChange={(event) =>
                                            userForm.setData(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        className={`${inputClass} pr-11`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (current) => !current,
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Sembunyikan password baru'
                                                : 'Tampilkan password baru'
                                        }
                                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#6f7680]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-[18px]" />
                                        ) : (
                                            <Eye className="size-[18px]" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    className="mt-1 text-[11px]"
                                    message={userForm.errors.password}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-[12px] leading-4 font-medium text-[#151515]"
                                >
                                    Konfirmasi Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={
                                            showConfirmation
                                                ? 'text'
                                                : 'password'
                                        }
                                        autoComplete="new-password"
                                        value={
                                            userForm.data.password_confirmation
                                        }
                                        onChange={(event) =>
                                            userForm.setData(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        className={`${inputClass} pr-11`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmation(
                                                (current) => !current,
                                            )
                                        }
                                        aria-label={
                                            showConfirmation
                                                ? 'Sembunyikan konfirmasi password'
                                                : 'Tampilkan konfirmasi password'
                                        }
                                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#6f7680]"
                                    >
                                        {showConfirmation ? (
                                            <EyeOff className="size-[18px]" />
                                        ) : (
                                            <Eye className="size-[18px]" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    className="mt-1 text-[11px]"
                                    message={
                                        userForm.errors.password_confirmation
                                    }
                                />
                            </div>

                            <p className="text-[11px] leading-4 text-[#858585]">
                                Kosongkan password jika tidak ingin mengubahnya
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={userForm.processing}
                            className="mt-2 h-10 w-[170px] rounded-[10px] bg-[linear-gradient(90deg,#ffc400_0%,#ffa600_100%)] text-[12px] font-medium text-[#121212] shadow-[0_4px_10px_rgba(253,185,0,0.15)] disabled:opacity-60"
                            data-test="save-user-settings"
                        >
                            Simpan Data Pengguna
                        </button>
                    </form>
                </section>

                <section className="px-4 pt-4">
                    <h2 className="text-[16px] leading-5 font-semibold">
                        Data Toko
                    </h2>
                    <form onSubmit={submitBusiness} className="mt-2">
                        <div className="rounded-[14px] bg-white px-4 py-[14px] shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                            <div className="space-y-3">
                                <BusinessRow label="Tipe Toko">
                                    <div className="relative">
                                        <select
                                            name="business_category"
                                            value={
                                                businessForm.data
                                                    .business_category
                                            }
                                            onChange={(event) =>
                                                businessForm.setData(
                                                    'business_category',
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClass} appearance-none pr-10`}
                                        >
                                            <option>Toko Kelontong</option>
                                            <option>Minimarket</option>
                                            <option>Grosir</option>
                                            <option>Supplier</option>
                                            <option>Lainnya</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#151515]" />
                                    </div>
                                    <InputError
                                        className="mt-1 text-[11px]"
                                        message={
                                            businessForm.errors
                                                .business_category
                                        }
                                    />
                                </BusinessRow>

                                <BusinessRow label="Nama Toko">
                                    <input
                                        name="name"
                                        required
                                        value={businessForm.data.name}
                                        onChange={(event) =>
                                            businessForm.setData(
                                                'name',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    <InputError
                                        className="mt-1 text-[11px]"
                                        message={businessForm.errors.name}
                                    />
                                </BusinessRow>

                                <BusinessRow label="Nama Owner">
                                    <input
                                        name="owner_name"
                                        required
                                        value={businessForm.data.owner_name}
                                        onChange={(event) =>
                                            businessForm.setData(
                                                'owner_name',
                                                event.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    <InputError
                                        className="mt-1 text-[11px]"
                                        message={businessForm.errors.owner_name}
                                    />
                                </BusinessRow>

                                <BusinessRow label="No HP">
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 fill-[#6f7680] text-[#6f7680]" />
                                        <input
                                            name="phone"
                                            required
                                            inputMode="tel"
                                            value={businessForm.data.phone}
                                            onChange={(event) =>
                                                businessForm.setData(
                                                    'phone',
                                                    event.target.value,
                                                )
                                            }
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                    <InputError
                                        className="mt-1 text-[11px]"
                                        message={businessForm.errors.phone}
                                    />
                                </BusinessRow>

                                <BusinessRow label="Alamat">
                                    <textarea
                                        name="address"
                                        required
                                        value={businessForm.data.address}
                                        onChange={(event) =>
                                            businessForm.setData(
                                                'address',
                                                event.target.value,
                                            )
                                        }
                                        className="h-20 w-full resize-none rounded-[10px] border border-[#d5d5d5] bg-white px-3 py-[10px] text-[13px] text-[#0e223e] transition outline-none focus:border-[#fdb900] focus:ring-1 focus:ring-[#fdb900]/25"
                                    />
                                    <InputError
                                        className="mt-1 text-[11px]"
                                        message={businessForm.errors.address}
                                    />
                                </BusinessRow>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={businessForm.processing}
                            className="mt-2 h-10 w-[150px] rounded-[10px] bg-[linear-gradient(90deg,#ffc400_0%,#ffa600_100%)] text-[12px] font-medium text-[#121212] shadow-[0_4px_10px_rgba(253,185,0,0.15)] disabled:opacity-60"
                            data-test="save-business-settings"
                        >
                            Simpan Data Toko
                        </button>
                    </form>
                </section>

                <section className="mx-4 mt-4 overflow-hidden rounded-[14px] bg-white shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                    <Form {...logout.form()}>
                        {({ processing }) => (
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-11 w-full items-center px-4 text-[12px]"
                                data-test="logout-button"
                            >
                                <span className="mr-3 flex size-6 items-center justify-center rounded-[7px] bg-[#ff3b22] text-white">
                                    <LogOut className="size-[14px]" />
                                </span>
                                Logout
                                <ChevronRight className="ml-auto size-4 text-[#666666]" />
                            </button>
                        )}
                    </Form>
                    <div className="flex h-11 items-center border-t border-[#ededed] px-4 text-[12px]">
                        <span className="mr-3 flex size-6 items-center justify-center rounded-[7px] bg-[#1f54dc] text-white">
                            <Info className="size-[14px]" />
                        </span>
                        Versi Aplikasi
                        <span className="ml-auto text-[#858585]">1.2.3</span>
                        <ChevronRight className="ml-2 size-4 text-[#666666]" />
                    </div>
                    <button
                        type="button"
                        className="flex h-11 w-full items-center border-t border-[#ededed] px-4 text-[12px]"
                    >
                        <span className="mr-3 flex size-6 items-center justify-center rounded-[7px] bg-[#2bbca8] text-white">
                            <HelpCircle className="size-[15px]" />
                        </span>
                        Bantuan
                        <ChevronRight className="ml-auto size-4 text-[#666666]" />
                    </button>
                </section>
            </div>

            <Dialog
                open={passwordDialogOpen}
                onOpenChange={setPasswordDialogOpen}
            >
                <DialogContent className="max-w-[353px] rounded-[18px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Password</DialogTitle>
                        <DialogDescription>
                            Masukkan password saat ini untuk menyimpan password
                            baru.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitUser}>
                        <label
                            htmlFor="current_password"
                            className="text-sm font-medium"
                        >
                            Password Saat Ini
                        </label>
                        <input
                            id="current_password"
                            type="password"
                            autoComplete="current-password"
                            autoFocus
                            value={userForm.data.current_password}
                            onChange={(event) =>
                                userForm.setData(
                                    'current_password',
                                    event.target.value,
                                )
                            }
                            className="mt-2 h-11 w-full rounded-[10px] border border-[#d5d5d5] px-3 outline-none focus:border-[#fdb900]"
                        />
                        <InputError
                            className="mt-2"
                            message={userForm.errors.current_password}
                        />
                        {passwordRules && (
                            <p className="mt-2 text-xs text-[#858585]">
                                {passwordRules}
                            </p>
                        )}
                        <DialogFooter className="mt-5">
                            <button
                                type="button"
                                onClick={() => setPasswordDialogOpen(false)}
                                className="h-10 rounded-[10px] border px-4"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={userForm.processing}
                                className="h-10 rounded-[10px] bg-[#fdb900] px-4 font-medium text-[#121212] disabled:opacity-60"
                            >
                                Simpan
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function BusinessRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <span className="block text-[12px] leading-4 font-medium">
                {label}
            </span>
            <div>{children}</div>
        </div>
    );
}
