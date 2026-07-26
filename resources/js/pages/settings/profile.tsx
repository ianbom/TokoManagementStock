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
    LockKeyhole,
    LogOut,
    Phone,
    Store,
    UserRound,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
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
    'h-[22px] w-full rounded-[7px] border border-[#d5d5d5] bg-white px-[8px] text-[9px] text-[#0e223e] outline-none transition focus:border-[#fdb900] focus:ring-1 focus:ring-[#fdb900]/25';

export default function Profile() {
    const { auth, business, passwordRules } = usePage<PageProps>().props;
    const userSection = useRef<HTMLElement>(null);
    const businessSection = useRef<HTMLElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    const userForm = useForm({
        name: auth.user.name,
        password: '',
        password_confirmation: '',
        current_password: '',
    });
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

        userForm.patch(ProfileController.update.url(), {
            preserveScroll: true,
            onSuccess: () => {
                userForm.reset(
                    'password',
                    'password_confirmation',
                    'current_password',
                );
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

    const scrollTo = (target: HTMLElement | null) => {
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <Head title="Pengaturan" />

            <div className="min-h-[821px] bg-[#fff9e8] pb-[66px] text-[#0e223e]">
                <header
                    className="relative h-[107px] overflow-hidden rounded-b-[31px] bg-cover bg-[position:66%_center] px-[18px] pt-[11px] text-white"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="absolute inset-0 bg-[rgba(8,31,58,0.86)]" />

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

                    <div className="relative mt-[13px]">
                        <h1 className="text-[19px] leading-6 font-bold tracking-[-0.3px]">
                            Pengaturan
                        </h1>
                        <p className="mt-[2px] text-[11px] leading-4 text-white/95">
                            Kelola data akun dan toko Anda
                        </p>
                    </div>
                </header>

                <nav
                    aria-label="Bagian pengaturan"
                    className="mx-[10px] mt-[10px] grid h-[45px] grid-cols-3 rounded-[10px] bg-white p-[5px] shadow-[0_5px_16px_rgba(14,34,62,0.05)]"
                >
                    <button
                        type="button"
                        onClick={() => scrollTo(userSection.current)}
                        className="flex items-center justify-between rounded-[8px] bg-[linear-gradient(90deg,#fff8dc_0%,#fff2bd_100%)] px-[7px] text-[8px] font-medium"
                    >
                        <span className="flex items-center gap-[7px]">
                            <span className="flex size-[24px] items-center justify-center rounded-[6px] bg-[#fdb900] text-white shadow-[0_4px_8px_rgba(253,185,0,0.20)]">
                                <UserRound
                                    className="size-[15px] fill-white"
                                    strokeWidth={1.7}
                                />
                            </span>
                            Data Pengguna
                        </span>
                        <ChevronRight className="size-3" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollTo(businessSection.current)}
                        className="flex items-center justify-between px-[7px] text-[8px] font-medium"
                    >
                        <span className="flex items-center gap-[7px]">
                            <span className="flex size-[24px] items-center justify-center rounded-[6px] bg-[linear-gradient(145deg,#d51ec9,#8f0f9f)] text-white">
                                <Store className="size-[14px] fill-white" />
                            </span>
                            Data Toko
                        </span>
                        <ChevronRight className="size-3" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            scrollTo(userSection.current);
                            window.setTimeout(
                                () => passwordInput.current?.focus(),
                                350,
                            );
                        }}
                        className="flex items-center justify-between px-[7px] text-[8px] font-medium"
                    >
                        <span className="flex items-center gap-[7px]">
                            <span className="flex size-[24px] items-center justify-center rounded-[6px] bg-[linear-gradient(145deg,#20c9a8,#009e80)] text-white">
                                <LockKeyhole className="size-[14px] fill-white/20" />
                            </span>
                            Keamanan Akun
                        </span>
                        <ChevronRight className="size-3" />
                    </button>
                </nav>

                <section
                    ref={userSection}
                    className="scroll-mt-3 px-[10px] pt-[12px]"
                >
                    <h2 className="px-[7px] text-[13px] leading-4 font-semibold">
                        Data Pengguna
                    </h2>
                    <form onSubmit={submitUser} className="mt-[5px]">
                        <div className="space-y-[5px] rounded-[10px] bg-white px-[11px] py-[8px] shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-[8px] leading-[10px] font-medium text-[#151515]"
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
                                    className="mt-1 text-[8px]"
                                    message={userForm.errors.name}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-[8px] leading-[10px] font-medium text-[#151515]"
                                >
                                    Password Baru
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        ref={passwordInput}
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
                                        className={`${inputClass} pr-8`}
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
                                        className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-[#6f7680]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-[14px]" />
                                        ) : (
                                            <Eye className="size-[14px]" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    className="mt-1 text-[8px]"
                                    message={userForm.errors.password}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-[8px] leading-[10px] font-medium text-[#151515]"
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
                                        className={`${inputClass} pr-8`}
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
                                        className="absolute inset-y-0 right-0 flex w-8 items-center justify-center text-[#6f7680]"
                                    >
                                        {showConfirmation ? (
                                            <EyeOff className="size-[14px]" />
                                        ) : (
                                            <Eye className="size-[14px]" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    className="mt-1 text-[8px]"
                                    message={
                                        userForm.errors.password_confirmation
                                    }
                                />
                            </div>

                            <p className="text-[7px] leading-[9px] text-[#858585]">
                                Kosongkan password jika tidak ingin mengubahnya
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={userForm.processing}
                            className="mt-[5px] h-[25px] w-full rounded-[7px] bg-[linear-gradient(90deg,#ffc400_0%,#ffa600_100%)] text-[10px] font-medium text-[#121212] shadow-[0_4px_10px_rgba(253,185,0,0.15)] disabled:opacity-60"
                            data-test="save-user-settings"
                        >
                            Simpan Data Pengguna
                        </button>
                    </form>
                </section>

                <section
                    ref={businessSection}
                    className="scroll-mt-3 px-[10px] pt-[9px]"
                >
                    <h2 className="px-[7px] text-[13px] leading-4 font-semibold">
                        Data Toko
                    </h2>
                    <form
                        onSubmit={submitBusiness}
                        className="mt-[5px] rounded-[10px] bg-white px-[11px] py-[8px] shadow-[0_4px_14px_rgba(14,34,62,0.04)]"
                    >
                        <div className="space-y-[3px]">
                            <BusinessRow label="Tipe Toko">
                                <div className="relative">
                                    <select
                                        name="business_category"
                                        value={
                                            businessForm.data.business_category
                                        }
                                        onChange={(event) =>
                                            businessForm.setData(
                                                'business_category',
                                                event.target.value,
                                            )
                                        }
                                        className={`${inputClass} appearance-none pr-7`}
                                    >
                                        <option>Toko Kelontong</option>
                                        <option>Minimarket</option>
                                        <option>Grosir</option>
                                        <option>Supplier</option>
                                        <option>Lainnya</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-[8px] size-3 -translate-y-1/2 text-[#151515]" />
                                </div>
                                <InputError
                                    className="mt-1 text-[8px]"
                                    message={
                                        businessForm.errors.business_category
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
                                    className="mt-1 text-[8px]"
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
                                    className="mt-1 text-[8px]"
                                    message={businessForm.errors.owner_name}
                                />
                            </BusinessRow>

                            <BusinessRow label="No HP">
                                <div className="relative">
                                    <Phone className="absolute top-1/2 left-[8px] size-[12px] -translate-y-1/2 fill-[#6f7680] text-[#6f7680]" />
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
                                        className={`${inputClass} pl-[25px]`}
                                    />
                                </div>
                                <InputError
                                    className="mt-1 text-[8px]"
                                    message={businessForm.errors.phone}
                                />
                            </BusinessRow>

                            <BusinessRow label="Alamat" alignStart>
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
                                    className="h-[38px] w-full resize-none rounded-[7px] border border-[#d5d5d5] bg-white px-[8px] py-[6px] text-[9px] text-[#0e223e] transition outline-none focus:border-[#fdb900] focus:ring-1 focus:ring-[#fdb900]/25"
                                />
                                <InputError
                                    className="mt-1 text-[8px]"
                                    message={businessForm.errors.address}
                                />
                            </BusinessRow>
                        </div>

                        <div className="mt-[6px] flex min-h-[38px] items-center rounded-[8px] bg-[linear-gradient(90deg,#fff9e8,#fff4d4)] px-[9px] text-[8px] leading-[10px] text-[#0e223e]">
                            <span className="mr-[9px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#f6a900] text-white">
                                <Info className="size-[11px]" />
                            </span>
                            Pastikan data toko sesuai agar supplier lebih mudah
                            menemukan bisnis Anda
                        </div>

                        <button
                            type="submit"
                            disabled={businessForm.processing}
                            className="mt-[6px] h-[28px] w-full rounded-[7px] bg-[linear-gradient(90deg,#ffc400_0%,#ffa600_100%)] text-[10px] font-medium text-[#121212] shadow-[0_4px_10px_rgba(253,185,0,0.15)] disabled:opacity-60"
                            data-test="save-business-settings"
                        >
                            Simpan Data Toko
                        </button>
                    </form>
                </section>

                <section className="mx-[10px] mt-[9px] overflow-hidden rounded-[10px] bg-white shadow-[0_4px_14px_rgba(14,34,62,0.04)]">
                    <Form {...logout.form()}>
                        {({ processing }) => (
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-[30px] w-full items-center px-[12px] text-[9px]"
                                data-test="logout-button"
                            >
                                <span className="mr-[10px] flex size-[19px] items-center justify-center rounded-[5px] bg-[#ff3b22] text-white">
                                    <LogOut className="size-[12px]" />
                                </span>
                                Logout
                                <ChevronRight className="ml-auto size-3 text-[#666666]" />
                            </button>
                        )}
                    </Form>
                    <div className="flex h-[30px] items-center border-t border-[#ededed] px-[12px] text-[9px]">
                        <span className="mr-[10px] flex size-[19px] items-center justify-center rounded-[5px] bg-[#1f54dc] text-white">
                            <Info className="size-[12px]" />
                        </span>
                        Versi Aplikasi
                        <span className="ml-auto text-[#858585]">1.2.3</span>
                        <ChevronRight className="ml-[8px] size-3 text-[#666666]" />
                    </div>
                    <button
                        type="button"
                        className="flex h-[30px] w-full items-center border-t border-[#ededed] px-[12px] text-[9px]"
                    >
                        <span className="mr-[10px] flex size-[19px] items-center justify-center rounded-[5px] bg-[#2bbca8] text-white">
                            <HelpCircle className="size-[13px]" />
                        </span>
                        Bantuan
                        <ChevronRight className="ml-auto size-3 text-[#666666]" />
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
    alignStart = false,
}: {
    label: string;
    children: React.ReactNode;
    alignStart?: boolean;
}) {
    return (
        <div
            className={`grid grid-cols-[66px_1fr] gap-[8px] ${alignStart ? 'items-start' : 'items-center'}`}
        >
            <span
                className={`text-[8px] leading-[10px] font-medium ${alignStart ? 'pt-[7px]' : ''}`}
            >
                {label}
            </span>
            <div>{children}</div>
        </div>
    );
}
