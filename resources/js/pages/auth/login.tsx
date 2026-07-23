import { Form, Head } from '@inertiajs/react';
import { LockKeyhole, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Login" />

            {status && (
                <div className="mb-4 rounded-[12px] bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-[18px]">
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
                                        name="email"
                                        required
                                        tabIndex={1}
                                        autoComplete="email"
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
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Masukkan Password"
                                        className="h-[52px] rounded-[12px] border-[#dedede] bg-white pr-12 pl-12 text-[16px] shadow-none placeholder:text-[#858585] focus-visible:border-[#fdb900] focus-visible:ring-[#fdb900]/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="size-5 rounded-[6px] border-[#dedede] data-[state=checked]:border-[#fdb900] data-[state=checked]:bg-[#fdb900] data-[state=checked]:text-[#121212]"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-[15px] font-normal text-[#858585]"
                                >
                                    Ingat Saya
                                </Label>
                            </div>

                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="text-[15px] font-medium text-[#252525] no-underline"
                                    tabIndex={5}
                                >
                                    Lupa Password
                                </TextLink>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="mt-5 h-[58px] w-full rounded-[12px] bg-[linear-gradient(90deg,#ffa600_0%,#ffc900_100%)] text-[17px] font-medium text-[#121212] shadow-[0_8px_16px_rgba(253,185,0,0.18)] hover:brightness-95"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            Login
                        </Button>

                        <div className="mt-5 text-center text-[15px] text-[#858585]">
                            Belum punya akun?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="font-semibold text-[#252525] no-underline"
                            >
                                Daftar
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang',
    description: 'Silakan login untuk melanjutkan',
};
