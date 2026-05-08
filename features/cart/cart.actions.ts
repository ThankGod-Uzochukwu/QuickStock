import { loadPersistedState, persistState } from '@/services/storage/persistence.service';
import { STORAGE_KEYS } from '@/services/storage/storage.adapter';
import { AppDispatch, RootState } from '@/store/store';
import { selectProductById } from '../products/products.selectors';
import {
    cartCleared,
    cartErrorSet,
    cartHydrated,
    cartItemAdded,
    cartItemQuantityUpdated,
    cartItemRemoved,
} from './cart.slice';

export const loadCart = () => async (dispatch: AppDispatch) => {
    try {
        const stored = await loadPersistedState<RootState['cart']['items']>(STORAGE_KEYS.CART);
        dispatch(cartHydrated(stored ?? []));
    } catch (error) {
        console.error('Failed to load cart:', error);
        dispatch(cartHydrated([]));
    }
};

export const addToCart = (productId: string, quantity = 1) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const product = selectProductById(state, productId);

            if (!product) {
                dispatch(cartErrorSet('This product is no longer available.'));
                return;
            }

            dispatch(cartItemAdded({ productId, quantity }));

            const updatedState = getState();
            await persistState(STORAGE_KEYS.CART, updatedState.cart.items);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            dispatch(cartErrorSet('Unable to update cart right now.'));
        }
    };

export const removeFromCart = (productId: string) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            dispatch(cartItemRemoved(productId));

            const updatedState = getState();
            await persistState(STORAGE_KEYS.CART, updatedState.cart.items);
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            dispatch(cartErrorSet('Unable to update cart right now.'));
        }
    };

export const updateCartQuantity = (productId: string, quantity: number) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            dispatch(cartItemQuantityUpdated({ productId, quantity }));

            const updatedState = getState();
            await persistState(STORAGE_KEYS.CART, updatedState.cart.items);
        } catch (error) {
            console.error('Failed to update cart quantity:', error);
            dispatch(cartErrorSet('Unable to update cart right now.'));
        }
    };

export const clearCart = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        dispatch(cartCleared());

        const updatedState = getState();
        await persistState(STORAGE_KEYS.CART, updatedState.cart.items);
    } catch (error) {
        console.error('Failed to clear cart:', error);
        dispatch(cartErrorSet('Unable to update cart right now.'));
    }
};
