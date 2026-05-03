import { loadPersistedState, persistState } from '../../services/storage/persistence.service';
import { STORAGE_KEYS } from '../../services/storage/storage.adapter';
import { AppDispatch, RootState } from '../../store/store';
import { CartItem } from '../products/types';
import { cartCleared, cartHydrated, cartItemAdded, cartItemQuantitySet, cartItemRemoved } from './cart.slice';

export const hydrateCart = () => async (dispatch: AppDispatch) => {
    try {
        const items = await loadPersistedState<CartItem[]>(STORAGE_KEYS.CART);
        dispatch(cartHydrated(items ?? []));
    } catch (error) {
        console.error('Failed to hydrate cart:', error);
        dispatch(cartHydrated([]));
    }
};

export const addToCart = (productId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(cartItemAdded(productId));
    await persistState(STORAGE_KEYS.CART, getState().cart.items);
};

export const setCartQuantity =
    (productId: string, quantity: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(cartItemQuantitySet({ productId, quantity }));
        await persistState(STORAGE_KEYS.CART, getState().cart.items);
    };

export const removeFromCart = (productId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(cartItemRemoved(productId));
    await persistState(STORAGE_KEYS.CART, getState().cart.items);
};

export const clearCart = () => async (dispatch: AppDispatch) => {
    dispatch(cartCleared());
    await persistState(STORAGE_KEYS.CART, [] as CartItem[]);
};