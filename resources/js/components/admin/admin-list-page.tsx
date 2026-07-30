import { router } from '@inertiajs/react';
import {
    IconArrowDown,
    IconArrowUp,
    IconTrendingDown,
    IconTrendingUp,
} from '@tabler/icons-react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ComponentType, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export type AdminMetric = {
    value: number;
    change: number | null;
};

export type AdminFilters = {
    search: string;
    sort: string;
    direction: 'asc' | 'desc';
};

export type AdminPaginator<TData> = {
    data: TData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type AdminKpi = {
    label: string;
    value: string;
    description: string;
    change: number | null;
    icon: ComponentType<{ className?: string }>;
};

export default function AdminListPage<TData>({
    kpis,
    rows,
    filters,
    columns,
    routeUrl,
    tableTitle,
    tableDescription,
    searchPlaceholder,
    children,
}: {
    kpis: AdminKpi[];
    rows: AdminPaginator<TData>;
    filters: AdminFilters;
    columns: ColumnDef<TData>[];
    routeUrl: string;
    tableTitle: string;
    tableDescription: string;
    searchPlaceholder: string;
    children?: ReactNode;
}) {
    'use no memo';

    const [search, setSearch] = useState(filters.search);
    const sorting = useMemo<SortingState>(
        () => [
            {
                id: filters.sort,
                desc: filters.direction === 'desc',
            },
        ],
        [filters.direction, filters.sort],
    );
    const table = useReactTable({
        data: rows.data,
        columns,
        state: { sorting },
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        setSearch(filters.search);
    }, [filters.search]);

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            visit(routeUrl, filters, { search, page: 1 });
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters, routeUrl, search]);

    return (
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi) => (
                    <KpiCard key={kpi.label} {...kpi} />
                ))}
            </section>

            {children}

            <Card>
                <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>{tableTitle}</CardTitle>
                        <CardDescription>{tableDescription}</CardDescription>
                    </div>
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        className="sm:max-w-xs"
                    />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const direction =
                                                            filters.sort ===
                                                                header.column
                                                                    .id &&
                                                            filters.direction ===
                                                                'asc'
                                                                ? 'desc'
                                                                : 'asc';
                                                        visit(
                                                            routeUrl,
                                                            filters,
                                                            {
                                                                sort: header
                                                                    .column.id,
                                                                direction,
                                                                page: 1,
                                                            },
                                                        );
                                                    }}
                                                    className="flex items-center gap-1"
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {filters.sort ===
                                                        header.column.id &&
                                                        (filters.direction ===
                                                        'asc' ? (
                                                            <IconArrowUp className="size-3" />
                                                        ) : (
                                                            <IconArrowDown className="size-3" />
                                                        ))}
                                                </button>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Tidak ada data yang cocok.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="justify-between border-t">
                    <p className="text-sm text-muted-foreground">
                        Halaman {rows.current_page} dari {rows.last_page || 1} ·{' '}
                        {rows.total} data
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={rows.prev_page_url === null}
                            onClick={() =>
                                rows.prev_page_url &&
                                router.visit(rows.prev_page_url, {
                                    preserveScroll: true,
                                    preserveState: true,
                                })
                            }
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={rows.next_page_url === null}
                            onClick={() =>
                                rows.next_page_url &&
                                router.visit(rows.next_page_url, {
                                    preserveScroll: true,
                                    preserveState: true,
                                })
                            }
                        >
                            Berikutnya
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

function visit(
    routeUrl: string,
    filters: AdminFilters,
    changes: Partial<AdminFilters> & { page?: number },
) {
    router.get(
        routeUrl,
        { ...filters, ...changes },
        {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        },
    );
}

function KpiCard({ label, value, description, change, icon: Icon }: AdminKpi) {
    const positive = change !== null && change >= 0;
    const TrendIcon = positive ? IconTrendingUp : IconTrendingDown;

    return (
        <Card className="@container/card relative">
            <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {value}
                </CardTitle>
                {change !== null && (
                    <div className="absolute top-6 right-6">
                        <Badge variant="outline">
                            <TrendIcon />
                            {change > 0 ? '+' : ''}
                            {change.toLocaleString('id-ID')}%
                        </Badge>
                    </div>
                )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    {description} <Icon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                    Data aktual platform
                </div>
            </CardFooter>
        </Card>
    );
}
