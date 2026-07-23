import * as React from 'react';
import { cn } from '@/lib/utils';

export function AppContent({
    children,
    className,
    ...props
}: React.ComponentProps<'main'>) {
    return (
        <main
            className={cn(
                'relative mx-auto min-h-screen w-full max-w-[393px] overflow-x-hidden bg-[#fef9e8] pb-[calc(108px+env(safe-area-inset-bottom))] text-[#252525] shadow-[0_0_30px_rgba(14,34,62,0.12)]',
                className,
            )}
            {...props}
        >
            {children}
        </main>
    );
}
