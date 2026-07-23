import { Form, Head } from '@inertiajs/react';
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col"
            >
                {({ processing, errors }) => (
                    <>
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
                                        name="name"
                                        placeholder="Masukkan nama lengkap"
                                        className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-4 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                                    />
                                </div>
                                <InputError message={errors.name} />
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
                                        name="email"
                                        placeholder="Masukkan email"
                                        className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-4 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
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
                                        name="password"
                                        placeholder="Masukkan Password"
                                        passwordrules={passwordRules}
                                        className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-12 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
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
                                        name="password_confirmation"
                                        placeholder="Ulangi Password"
                                        passwordrules={passwordRules}
                                        className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-12 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="mt-5 h-[58px] w-full rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[17px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.18)] hover:brightness-95"
                            tabIndex={5}
                            disabled={processing}
                            data-test="register-user-button"
                        >
                            {processing && <Spinner />}
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
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun',
    description: 'Silakan lengkapi data untuk mendaftar',
};
