export interface OrderCustomer {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface OrderLine {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUri: string;
    lineTotal: number;
}

export interface OrderTotals {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export interface Order {
    id: string;
    customer: OrderCustomer;
    items: OrderLine[];
    totals: OrderTotals;
    createdAt: number;
}
