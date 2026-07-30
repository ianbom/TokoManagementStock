import confirmationReference from '../../../../Design/Stock/Stock-In-confirmation.png';

export type StockDraftProduct = {
    id: string;
    name: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    image_url: string | null;
};

export type StockReceiptProduct = {
    id: number;
    name: string;
    purchase_price: number;
    selling_price: number;
    quantity_added: number;
    stock_after: number;
    image_url: string | null;
};

export function formatRupiah(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

export function ProductThumbnail({
    product,
    className = 'size-[78px]',
}: {
    product: Pick<StockDraftProduct, 'name' | 'image_url'>;
    className?: string;
}) {
    return (
        <span
            role="img"
            aria-label={`Foto ${product.name}`}
            className={`block shrink-0 rounded-[12px] bg-white bg-no-repeat ${className}`}
            style={{
                backgroundImage: `url(${product.image_url ?? confirmationReference})`,
                backgroundPosition: product.image_url
                    ? 'center'
                    : '-36px -339px',
                backgroundSize: product.image_url ? 'contain' : '393px 1284px',
            }}
        />
    );
}
