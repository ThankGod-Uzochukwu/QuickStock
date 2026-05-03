import { RootState } from '@/store/store';
import { Product } from '../products/types';

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartLineCount = (state: RootState) => state.cart.items.length;

export const selectCartDetailedItems = (state: RootState, products: Product[]) =>
    state.cart.items
        .map((item) => {
            const product = products.find((entry) => entry.id === item.productId);

            if (!product) {
                return null;
            }

            return {
                ...item,
                product,
                lineTotal: product.price * item.quantity,
            };
        })
        .filter(Boolean);

export const selectCartSubtotal = (state: RootState, products: Product[]) =>
    selectCartDetailedItems(state, products).reduce((total, item) => total + item!.lineTotal, 0);