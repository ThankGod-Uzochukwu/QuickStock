import { RootState } from '@/store/store';
import { Product } from '../products/types';

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartItemCount = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartLineCount = (state: RootState) => state.cart.items.length;

type CartDetailedItem = (typeof import('./cart.slice').cartItemAdded) extends never ? any : {
    productId: string;
    quantity: number;
    addedAt: number;
    product: Product;
    lineTotal: number;
};

export const selectCartDetailedItems = (state: RootState, products: Product[]): CartDetailedItem[] =>
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
        .filter((x): x is CartDetailedItem => Boolean(x));

export const selectCartSubtotal = (state: RootState, products: Product[]) =>
    selectCartDetailedItems(state, products).reduce((total, item) => total + item.lineTotal, 0);