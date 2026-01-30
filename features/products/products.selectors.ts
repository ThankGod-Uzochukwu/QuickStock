import { RootState } from '../../store/store';
import { Product, PRODUCT_LIMITS } from './types';

/**
 * Get all products
 */
export const selectAllProducts = (state: RootState): Product[] => {
    return state.products.items;
};

/**
 * Get products count
 */
export const selectProductsCount = (state: RootState): number => {
    return state.products.items.length;
};

/**
 * Check if product limit is reached
 */
export const selectIsProductLimitReached = (state: RootState): boolean => {
    return state.products.items.length >= PRODUCT_LIMITS.MAX_PRODUCTS;
};

/**
 * Get remaining product slots
 */
export const selectRemainingProductSlots = (state: RootState): number => {
    return Math.max(0, PRODUCT_LIMITS.MAX_PRODUCTS - state.products.items.length);
};

/**
 * Get product by ID
 */
export const selectProductById = (state: RootState, productId: string): Product | undefined => {
    return state.products.items.find((product) => product.id === productId);
};

/**
 * Get loading state
 */
export const selectProductsLoading = (state: RootState): boolean => {
    return state.products.loading;
};

/**
 * Get error state
 */
export const selectProductsError = (state: RootState): string | null => {
    return state.products.error;
};

/**
 * Get products sorted by creation date (newest first)
 */
export const selectProductsSortedByDate = (state: RootState): Product[] => {
    return [...state.products.items].sort((a, b) => b.createdAt - a.createdAt);
};
