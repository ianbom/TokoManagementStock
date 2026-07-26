import confirmationReference from '../../../../Design/Stock/Stock-In-confirmation.png';

export type StockProduct = {
    key: string;
    name: string;
    purchasePrice: number;
    sellingPrice: number;
    initialStock: number;
    defaultQuantity: number;
    spritePosition: string;
};

export const stockProducts: StockProduct[] = [
    {
        key: 'coffee',
        name: 'Kopi Kapal Api 200g',
        purchasePrice: 12000,
        sellingPrice: 15000,
        initialStock: 119,
        defaultQuantity: 5,
        spritePosition: '-36px -154px',
    },
    {
        key: 'noodles',
        name: 'Indomie Goreng',
        purchasePrice: 1500,
        sellingPrice: 2500,
        initialStock: 193,
        defaultQuantity: 7,
        spritePosition: '-36px -339px',
    },
    {
        key: 'water',
        name: 'Aqua 600 ml',
        purchasePrice: 2000,
        sellingPrice: 3000,
        initialStock: 90,
        defaultQuantity: 10,
        spritePosition: '-36px -527px',
    },
    {
        key: 'rice',
        name: 'Beras Premium 5 Kg',
        purchasePrice: 50000,
        sellingPrice: 62000,
        initialStock: 10,
        defaultQuantity: 15,
        spritePosition: '-36px -714px',
    },
    {
        key: 'oil',
        name: 'Minyak Goreng 1L',
        purchasePrice: 14500,
        sellingPrice: 16000,
        initialStock: 0,
        defaultQuantity: 20,
        spritePosition: '-36px -904px',
    },
];

export function formatRupiah(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

export function quantityFromUrl(url: string, product: StockProduct) {
    const query = url.includes('?') ? url.slice(url.indexOf('?') + 1) : '';
    const quantity = Number(new URLSearchParams(query).get(product.key));

    return Number.isInteger(quantity) && quantity >= 1
        ? quantity
        : product.defaultQuantity;
}

export function ProductThumbnail({ product }: { product: StockProduct }) {
    return (
        <span
            aria-hidden="true"
            className="block size-[78px] shrink-0 rounded-[12px] bg-white bg-no-repeat"
            style={{
                backgroundImage: `url(${confirmationReference})`,
                backgroundPosition: product.spritePosition,
                backgroundSize: '393px 1284px',
            }}
        />
    );
}
