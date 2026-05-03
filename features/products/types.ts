export interface Product {
    id: string;
    name: string;
    price: number;
    imageUri: string;
    createdAt: number; // Unix timestamp
    description: string;
    category: string;
    rating: number;
    reviewCount: number;
    inStock: number;
    featured: boolean;
    badge?: string;
    tags: string[];
}

/**
 * Business rules and constants.
 * These are the source of truth for product limits.
 */
export const PRODUCT_LIMITS = {
    MAX_PRODUCTS: 9999,
    MIN_PRICE: 0,
    MAX_PRICE: 999999.99,
    MAX_NAME_LENGTH: 100,
} as const;

export interface CartItem {
    productId: string;
    quantity: number;
    addedAt: number;
}

export interface CheckoutContact {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    postalCode: string;
}

export interface OrderSummary {
    id: string;
    createdAt: number;
    items: Array<{ product: Product; quantity: number }>;
    contact: CheckoutContact;
    subtotal: number;
    shipping: number;
    total: number;
    status: 'confirmed';
    confirmationCode: string;
}

/**
 * Validation result type for type-safe validation
 */
export type ValidationResult<T = void> =
    | { valid: true; data: T }
    | { valid: false; error: string };
