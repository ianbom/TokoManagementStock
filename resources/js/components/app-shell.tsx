import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export function AppShell({ children }: Props) {
    return <div className="min-h-screen bg-[#ececec]">{children}</div>;
}
