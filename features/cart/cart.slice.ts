import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../products/types';

export interface CartState {
    items: CartItem[];
    hydrated: boolean;
}

const initialState: CartState = {
    items: [],
    hydrated: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        cartHydrated(state, action: PayloadAction<CartItem[]>) {
            state.items = action.payload;
            state.hydrated = true;
        },
        cartItemAdded(state, action: PayloadAction<string>) {
            const existing = state.items.find((item) => item.productId === action.payload);

            if (existing) {
                existing.quantity += 1;
                return;
            }

            state.items.push({ productId: action.payload, quantity: 1, addedAt: Date.now() });
        },
        cartItemQuantitySet(
            state,
            action: PayloadAction<{ productId: string; quantity: number }>
        ) {
            const item = state.items.find((entry) => entry.productId === action.payload.productId);

            if (!item) {
                return;
            }

            if (action.payload.quantity <= 0) {
                state.items = state.items.filter((entry) => entry.productId !== action.payload.productId);
                return;
            }

            item.quantity = action.payload.quantity;
        },
        cartItemRemoved(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item.productId !== action.payload);
        },
        cartCleared(state) {
            state.items = [];
        },
    },
});

export const {
    cartHydrated,
    cartItemAdded,
    cartItemQuantitySet,
    cartItemRemoved,
    cartCleared,
} = cartSlice.actions;

export default cartSlice.reducer;