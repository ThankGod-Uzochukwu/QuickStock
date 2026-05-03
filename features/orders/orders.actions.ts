import { loadPersistedState, persistState } from '../../services/storage/persistence.service';
import { STORAGE_KEYS } from '../../services/storage/storage.adapter';
import { AppDispatch } from '../../store/store';
import { OrderSummary } from '../products/types';
import { orderConfirmed } from './orders.slice';

export const hydrateLatestOrder = () => async (dispatch: AppDispatch) => {
    try {
        const order = await loadPersistedState<OrderSummary>(STORAGE_KEYS.ORDERS);
        if (order) {
            dispatch(orderConfirmed(order));
        }
    } catch (error) {
        console.error('Failed to hydrate latest order:', error);
    }
};

export const confirmOrder = (order: OrderSummary) => async (dispatch: AppDispatch) => {
    dispatch(orderConfirmed(order));
    await persistState(STORAGE_KEYS.ORDERS, order);
};