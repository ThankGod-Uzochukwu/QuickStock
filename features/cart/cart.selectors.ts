import { RootState } from '@/store/store';
import { createSelector } from '@reduxjs/toolkit';
import { Product } from '../products/types';

export interface CartLine {
    product: Product;
    quantity: number;
    lineTotal: number;
}

export interface CartTotals {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

const SHIPPING_FEE = 6.5;
const TAX_RATE = 0.07;

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartError = (state: RootState) => state.cart.error;
const selectProducts = (state: RootState) => state.products.items;

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
    items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartQuantityMap = createSelector([selectCartItems], (items) => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
        map[item.productId] = item.quantity;
    });
    return map;
});

export const selectCartLines = createSelector(
    [selectCartItems, selectProducts],
    (items, products): CartLine[] => {
        return items
            .map((item) => {
                const product = products.find((candidate) => candidate.id === item.productId);
                if (!product) {
                    return null;
                }

                return {
                    product,
                    quantity: item.quantity,
                    lineTotal: roundCurrency(product.price * item.quantity),
                };
            })
            .filter((line): line is CartLine => Boolean(line));
    }
);

export const selectCartTotals = createSelector([selectCartLines], (lines): CartTotals => {
    const subtotal = roundCurrency(lines.reduce((sum, line) => sum + line.lineTotal, 0));
    const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
    const tax = roundCurrency(subtotal * TAX_RATE);
    const total = roundCurrency(subtotal + shipping + tax);

    return {
        subtotal,
        shipping,
        tax,
        total,
    };
});
