export interface Product {
    id: string;
    name: string;
    price: number;
    imageUri: string;
    createdAt: number; // Unix timestamp
}

/**
 * Business rules and constants.
 * These are the source of truth for product limits.
 */
export const PRODUCT_LIMITS = {
    MAX_PRODUCTS: 5,
    MIN_PRICE: 0,
    MAX_PRICE: 999999.99,
    MAX_NAME_LENGTH: 100,
} as const;

/**
 * Validation result type for type-safe validation
 */
export type ValidationResult<T = void> =
    | { valid: true; data: T }
    | { valid: false; error: string };
