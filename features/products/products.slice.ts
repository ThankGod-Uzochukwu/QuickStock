import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './types';

export interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        /**
         * Add a new product
         */
        productAdded(state, action: PayloadAction<Product>) {
            state.items.push(action.payload);
            state.error = null;
        },

        /**
         * Remove a product by ID
         */
        productRemoved(state, action: PayloadAction<string>) {
            state.items = state.items.filter((product) => product.id !== action.payload);
            state.error = null;
        },

        /**
         * Update an existing product
         */
        productUpdated(state, action: PayloadAction<Product>) {
            const index = state.items.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
                state.error = null;
            }
        },

        /**
         * Clear all products
         */
        productsCleared(state) {
            state.items = [];
            state.error = null;
        },

        /**
         * Set loading state
         */
        productsLoadingChanged(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        /**
         * Set error state
         */
        productsErrorSet(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },

        /**
         * Hydrate state from persistence
         */
        productsHydrated(state, action: PayloadAction<Product[]>) {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    productAdded,
    productRemoved,
    productUpdated,
    productsCleared,
    productsLoadingChanged,
    productsErrorSet,
    productsHydrated,
} = productsSlice.actions;

export default productsSlice.reducer;
