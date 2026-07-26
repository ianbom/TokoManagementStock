import { Head, useForm } from '@inertiajs/react';
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import supplierBackground from '../../../../Design/Register/bg-pilih-supplier.jpg';
import businessFormReference from '../../../../Design/Register/Forn Data Toko.png';

type Props = {
    passwordRules: string;
};

type RegisterStep = 'account' | 'role' | 'business';

type RegisterData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    account_type: 'store' | 'supplier';
    business_name: string;
    address: string;
    owner_name: string;
    phone: string;
    business_category: string;
};

function StoreIcon({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
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

export default function Register({ passwordRules }: Props) {
    const [step, setStep] = useState<RegisterStep>('account');
    const form = useForm<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        account_type: 'store',
        business_name: '',
        address: '',
        owner_name: '',
        phone: '',
        business_category: '',
    });

    const submitAccount = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.clearErrors();

        if (form.data.password !== form.data.password_confirmation) {
            form.setError(
                'password_confirmation',
                'Konfirmasi password tidak sama.',
            );

            return;
        }

        setStep('role');
    };

    const chooseAccountType = (accountType: 'store' | 'supplier') => {
        form.setData('account_type', accountType);
        setStep('business');
    };

    const submitRegistration = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(store().url, {
            preserveScroll: true,
            onError: (errors) => {
                const accountFields = [
                    'name',
                    'email',
                    'password',
                    'password_confirmation',
                ];

                setStep(
                    accountFields.some((field) => field in errors)
                        ? 'account'
                        : 'business',
                );
            },
            onSuccess: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar" />

            <form onSubmit={submitAccount} className="flex flex-col">
                <div className="grid gap-[18px]">
                    <div className="grid gap-2">
                        <Label
                            htmlFor="name"
                            className="text-[14px] leading-5 font-medium text-[#252525]"
                        >
                            Nama Lengkap
                        </Label>
                        <div className="relative">
                            <UserRound
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-[#727272]"
                                strokeWidth={1.8}
                            />
                            <Input
                                id="name"
                                type="text"
                                required
                                tabIndex={1}
                                autoComplete="name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                placeholder="Masukkan nama lengkap"
                                className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-4 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                            />
                        </div>
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label
                            htmlFor="email"
                            className="text-[14px] leading-5 font-medium text-[#252525]"
                        >
                            Email
                        </Label>
                        <div className="relative">
                            <Mail
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-[#727272]"
                                strokeWidth={1.8}
                            />
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                placeholder="Masukkan email"
                                className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-4 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                            />
                        </div>
                        <InputError message={form.errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label
                            htmlFor="password"
                            className="text-[14px] leading-5 font-medium text-[#252525]"
                        >
                            Password
                        </Label>
                        <div className="relative [&_button]:right-2 [&_button]:text-[#727272] [&_button_svg]:size-5">
                            <LockKeyhole
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 fill-[#727272] text-[#727272]"
                                strokeWidth={1.8}
                            />
                            <PasswordInput
                                id="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                                placeholder="Masukkan Password"
                                passwordrules={passwordRules}
                                className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-12 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                            />
                        </div>
                        <InputError message={form.errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label
                            htmlFor="password_confirmation"
                            className="text-[14px] leading-5 font-medium text-[#252525]"
                        >
                            Konfirmasi Password
                        </Label>
                        <div className="relative [&_button]:right-2 [&_button]:text-[#727272] [&_button_svg]:size-5">
                            <LockKeyhole
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 fill-[#727272] text-[#727272]"
                                strokeWidth={1.8}
                            />
                            <PasswordInput
                                id="password_confirmation"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={form.data.password_confirmation}
                                onChange={(event) =>
                                    form.setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                                placeholder="Ulangi Password"
                                passwordrules={passwordRules}
                                className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-12 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                            />
                        </div>
                        <InputError
                            message={form.errors.password_confirmation}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="mt-5 h-[58px] w-full rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[17px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.18)] hover:brightness-95"
                    tabIndex={5}
                    data-test="register-user-button"
                >
                    Daftar
                </Button>

                <div className="mt-5 text-center text-[15px] text-[#858585]">
                    Sudah punya akun?{' '}
                    <TextLink
                        href={login()}
                        tabIndex={6}
                        className="font-semibold text-[#252525] no-underline"
                    >
                        Login
                    </TextLink>
                </div>
            </form>

            {step === 'role' && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#ececec]">
                    <section
                        className="relative mx-auto min-h-[730px] w-full max-w-[393px] overflow-hidden bg-cover bg-[position:43%_center] text-white shadow-[0_0_30px_rgba(14,34,62,0.18)]"
                        style={{
                            backgroundImage: `url(${supplierBackground})`,
                        }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,39,70,0.72)_0%,rgba(5,39,70,0.83)_58%,rgba(2,27,53,0.98)_100%)]" />

                        <div className="relative flex min-h-[730px] flex-col items-center px-5 pt-[149px] text-center">
                            <div className="flex size-32 items-center justify-center rounded-full bg-white/25">
                                <StoreIcon className="size-16 text-[#ffc400]" />
                            </div>

                            <h1 className="mt-5 max-w-[355px] text-[26px] leading-[31px] font-bold tracking-[-0.5px]">
                                Apakah Anda ingin menjadi
                                <br />
                                Supplier juga?
                            </h1>

                            <p className="mt-[23px] max-w-[355px] text-[16px] leading-5 text-white/90">
                                Anda dapat mendaftarkan diri sebagai supplier
                                <br />
                                untuk menjual produk kepada toko lain.
                            </p>

                            <button
                                type="button"
                                onClick={() => chooseAccountType('supplier')}
                                className="mt-[18px] h-[61px] w-full rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[16px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.18)] transition active:scale-[0.99]"
                                data-test="choose-supplier"
                            >
                                Ya, saya ingin menjadi Supplier
                            </button>

                            <button
                                type="button"
                                onClick={() => chooseAccountType('store')}
                                className="mt-5 h-[60px] w-full rounded-[12px] border border-white bg-transparent text-[16px] font-semibold text-white transition active:scale-[0.99]"
                                data-test="choose-store"
                            >
                                Tidak, saya hanya pemilik Toko
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {step === 'business' && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-black">
                    <main className="relative mx-auto min-h-[964px] w-full max-w-[393px] overflow-hidden bg-[#203a60] shadow-[0_0_30px_rgba(14,34,62,0.18)]">
                        <div
                            className="h-[235px] bg-no-repeat"
                            style={{
                                backgroundImage: `url(${businessFormReference})`,
                                backgroundPosition: 'center top',
                                backgroundSize: '433px 964px',
                            }}
                        />

                        <section className="relative -mt-7 min-h-[757px] rounded-t-[20px] bg-white px-5 pt-10 pb-16">
                            <div className="text-center">
                                <h1 className="text-[26px] leading-8 font-bold tracking-[-0.4px]">
                                    Lengkapi Data Toko
                                </h1>
                                <p className="mt-4 text-[16px] leading-6 text-[#858585]">
                                    Isi data toko Anda untuk memulai
                                </p>
                            </div>

                            <form
                                onSubmit={submitRegistration}
                                className="mt-[21px]"
                            >
                                <div className="space-y-[23px]">
                                    <BusinessField
                                        id="business_name"
                                        label="Nama Toko"
                                        placeholder="Masukkan nama toko"
                                        value={form.data.business_name}
                                        error={form.errors.business_name}
                                        onChange={(value) =>
                                            form.setData('business_name', value)
                                        }
                                    />
                                    <BusinessField
                                        id="address"
                                        label="Alamat Toko"
                                        placeholder="Masukkan alamat toko"
                                        value={form.data.address}
                                        error={form.errors.address}
                                        onChange={(value) =>
                                            form.setData('address', value)
                                        }
                                    />
                                    <BusinessField
                                        id="owner_name"
                                        label="Nama Pemilik"
                                        placeholder="Masukkan nama pemilik"
                                        value={form.data.owner_name}
                                        error={form.errors.owner_name}
                                        onChange={(value) =>
                                            form.setData('owner_name', value)
                                        }
                                    />
                                    <BusinessField
                                        id="phone"
                                        label="Nomor HP"
                                        placeholder="Masukkan nomor HP"
                                        value={form.data.phone}
                                        error={form.errors.phone}
                                        inputMode="tel"
                                        autoComplete="tel"
                                        onChange={(value) =>
                                            form.setData('phone', value)
                                        }
                                    />
                                    <BusinessField
                                        id="business_category"
                                        label="Jenis Usaha"
                                        placeholder="Masukkan Jenis Usaha"
                                        value={form.data.business_category}
                                        error={form.errors.business_category}
                                        onChange={(value) =>
                                            form.setData(
                                                'business_category',
                                                value,
                                            )
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="mt-5 flex h-[60px] w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[17px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.18)] transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                                    data-test="register-business-button"
                                >
                                    {form.processing && <Spinner />}
                                    Daftar Toko
                                </button>
                            </form>
                        </section>
                    </main>
                </div>
            )}
        </>
    );
}

function BusinessField({
    id,
    label,
    placeholder,
    value,
    error,
    onChange,
    inputMode,
    autoComplete,
}: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
    inputMode?: 'text' | 'tel';
    autoComplete?: string;
}) {
    return (
        <div className="grid gap-[7px]">
            <Label
                htmlFor={id}
                className="text-[14px] leading-[18px] font-medium text-[#252525]"
            >
                {label}
            </Label>
            <Input
                id={id}
                required
                value={value}
                inputMode={inputMode}
                autoComplete={autoComplete}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-invalid={Boolean(error)}
                className="h-[52px] rounded-[12px] border-[#dedede] bg-[#fffdf6] px-5 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
            />
            <InputError message={error} className="mt-1" />
        </div>
    );
}

Register.layout = {
    title: 'Buat Akun',
    description: 'Silakan lengkapi data untuk mendaftar',
};
