export type SupplierOrderProduct = {
    key: string;
    name: string;
    unit: string;
    stock: string;
    price: number;
    quantity: number;
    imageClass: string;
    imagePosition: string;
};

export type SupplierOrderStore = {
    slug: string;
    name: string;
    category: string;
    address: string;
};

export const supplierOrderStores: SupplierOrderStore[] = [
    {
        slug: 'lumintu-grosir-ktt',
        name: 'Lumintu Grosir KTT',
        category: 'Grosir Sembako',
        address: 'Jl. Ketintang Baru Selatan No. 7',
    },
    {
        slug: 'rahayu-grosir',
        name: 'Rahayu Grosir',
        category: 'Kebutuhan Harian',
        address: 'Jl. Ketintang Madya No. 17',
    },
    {
        slug: 'kevin-frozen-food',
        name: 'Kevin Frozen Food',
        category: 'Frozen Food',
        address: 'Jl. Karah No. 19',
    },
    {
        slug: 'sumber-makmur',
        name: 'Sumber Makmur',
        category: 'Grosir Minuman',
        address: 'Jl. Gayungan PTT No. 12',
    },
    {
        slug: 'mitra-sembako-surabaya',
        name: 'Mitra Sembako Surabaya',
        category: 'Distributor Sembako',
        address: 'Jl. Ahmad Yani No. 88',
    },
];

export const supplierOrderProducts: SupplierOrderProduct[] = [
    {
        key: 'indomie-dus',
        name: 'Indomie Goreng',
        unit: 'Dus isi 40 pcs',
        stock: 'Stok: 28 dus',
        price: 128000,
        quantity: 2,
        imageClass: 'left-[38px] top-[17px] h-[71px] w-[96px]',
        imagePosition: '-57px -280px',
    },
    {
        key: 'aqua-dus',
        name: 'Aqua 600 ml',
        unit: 'Dus isi 24 botol',
        stock: 'Stok: 42 dus',
        price: 72000,
        quantity: 3,
        imageClass: 'left-[69px] top-[11px] h-[81px] w-[27px]',
        imagePosition: '-269px -274px',
    },
    {
        key: 'minyak-karton',
        name: 'Minyak Goreng 1L',
        unit: 'Karton isi 12 pcs',
        stock: 'Stok: 16 karton',
        price: 198000,
        quantity: 1,
        imageClass: 'left-[53px] top-[8px] h-[81px] w-[63px]',
        imagePosition: '-72px -433px',
    },
    {
        key: 'gula-karung',
        name: 'Gula Pasir 1kg',
        unit: 'Karung isi 25 pcs',
        stock: 'Stok: 20 karung',
        price: 355000,
        quantity: 2,
        imageClass: 'left-[50px] top-[8px] h-[74px] w-[71px]',
        imagePosition: '-69px -595px',
    },
    {
        key: 'beras-karung',
        name: 'Beras Ramos 5kg',
        unit: 'Karung isi 5 pack',
        stock: 'Stok: 18 karung',
        price: 275000,
        quantity: 0,
        imageClass: 'left-[47px] top-[8px] h-[81px] w-[72px]',
        imagePosition: '-247px -433px',
    },
    {
        key: 'teh-dus',
        name: 'Teh Pucuk 350ml',
        unit: 'Dus isi 24 botol',
        stock: 'Stok: 36 dus',
        price: 67000,
        quantity: 0,
        imageClass: 'left-[72px] top-0 h-[85px] w-[24px]',
        imagePosition: '-272px -587px',
    },
];

export const supplierOrderCart = supplierOrderProducts.filter(
    (product) => product.quantity > 0,
);

export const supplierOrderItemCount = supplierOrderCart.reduce(
    (total, product) => total + product.quantity,
    0,
);

export const supplierOrderTotal = supplierOrderCart.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
);

export function formatRupiah(value: number): string {
    return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

export function getSelectedSupplier(url: string): SupplierOrderStore {
    const query = url.split('?')[1] ?? '';
    const slug = new URLSearchParams(query).get('supplier');

    return (
        supplierOrderStores.find((supplier) => supplier.slug === slug) ??
        supplierOrderStores[0]
    );
}
