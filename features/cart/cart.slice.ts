import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './types';

export interface CartState {
    items: CartItem[];
    error: string | null;
}

const initialState: CartState = {
    items: [],
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        cartHydrated(state, action: PayloadAction<CartItem[]>) {
            state.items = action.payload;
            state.error = null;
        },
        cartItemAdded(state, action: PayloadAction<{ productId: string; quantity: number }>) {
            const existing = state.items.find((item) => item.productId === action.payload.productId);
            if (existing) {
                existing.quantity += action.payload.quantity;
                return;
            }

            state.items.push({
                productId: action.payload.productId,
                quantity: action.payload.quantity,
                addedAt: Date.now(),
            });
            state.error = null;
        },
        cartItemRemoved(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item.productId !== action.payload);
            state.error = null;
        },
        cartItemQuantityUpdated(state, action: PayloadAction<{ productId: string; quantity: number }>) {
            const existing = state.items.find((item) => item.productId === action.payload.productId);
            if (!existing) {
                return;
            }

            if (action.payload.quantity <= 0) {
                state.items = state.items.filter((item) => item.productId !== action.payload.productId);
                return;
            }

            existing.quantity = action.payload.quantity;
            state.error = null;
        },
        cartCleared(state) {
            state.items = [];
            state.error = null;
        },
        cartErrorSet(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const {
    cartHydrated,
    cartItemAdded,
    cartItemRemoved,
    cartItemQuantityUpdated,
    cartCleared,
    cartErrorSet,
} = cartSlice.actions;

export default cartSlice.reducer;
