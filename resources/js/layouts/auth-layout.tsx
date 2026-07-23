import { Head, Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import heroImage from '../../../Design/Dashboard/726397882a4390f69ff6c2a3f7a8974af5901339.png';
import inventrackLogo from '../../../Design/Login/WhatsApp Image 2026-05-01 at 10.35.17 1.png';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: AuthLayoutProps) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-svh bg-[#ececec]">
                <div className="relative mx-auto flex min-h-svh w-full max-w-[393px] flex-col overflow-hidden bg-[#0e223e] font-['Poppins',sans-serif] text-[#252525] shadow-[0_0_30px_rgba(14,34,62,0.12)]">
                    <header
                        className="relative flex h-[224px] shrink-0 items-end justify-center overflow-hidden bg-cover bg-[position:65%_center] pb-[63px]"
                        style={{
                            backgroundImage: 'url(' + heroImage + ')',
                        }}
                    >
                        <div className="absolute inset-0 bg-[rgba(8,31,58,0.86)]" />
                        <Link
                            href={home()}
                            aria-label="Kembali ke beranda"
                            className="relative z-10 flex items-center gap-2.5 text-white"
                        >
                            <img
                                src={inventrackLogo}
                                alt="Logo Inventrack"
                                className="size-[47px] rounded-[9px] object-contain"
                            />
                            <span className="text-[30px] leading-none font-semibold tracking-[-1px]">
                                Inventrack
                            </span>
                        </Link>
                    </header>

                    <section className="relative z-10 -mt-[23px] flex min-h-[529px] flex-1 flex-col rounded-t-[20px] bg-white px-5 pt-10 pb-10">
                        <div className="mb-[18px] text-center">
                            <h1 className="text-[31px] leading-[1.25] font-semibold tracking-[-0.5px]">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-4 text-[16px] leading-6 text-[#858585]">
                                    {description}
                                </p>
                            )}
                        </div>

                        {children}
                    </section>
                </div>
            </div>
        </>
    );
}
