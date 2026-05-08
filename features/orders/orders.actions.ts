import { loadPersistedState, persistState } from '@/services/storage/persistence.service';
import { STORAGE_KEYS } from '@/services/storage/storage.adapter';
import { AppDispatch, RootState } from '@/store/store';
import { clearCart } from '../cart/cart.actions';
import { selectCartLines, selectCartTotals } from '../cart/cart.selectors';
import { submitOrder } from './order.service';
import {
    orderHydrated,
    orderStatusReset,
    orderSubmissionFailed,
    orderSubmissionStarted,
    orderSubmissionSucceeded,
} from './orders.slice';
import { OrderCustomer, OrderLine } from './types';

const mapLinesToOrder = (lines: ReturnType<typeof selectCartLines>): OrderLine[] =>
    lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        price: line.product.price,
        quantity: line.quantity,
        imageUri: line.product.imageUri,
        lineTotal: line.lineTotal,
    }));

export const loadLastOrder = () => async (dispatch: AppDispatch) => {
    try {
        const stored = await loadPersistedState<RootState['orders']['lastOrder']>(
            STORAGE_KEYS.LAST_ORDER
        );
        dispatch(orderHydrated(stored ?? null));
    } catch (error) {
        console.error('Failed to load last order:', error);
        dispatch(orderHydrated(null));
    }
};

export const submitMockOrder = (customer: OrderCustomer) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(orderSubmissionStarted());

        const state = getState();
        const lines = selectCartLines(state);

        if (!lines.length) {
            dispatch(orderSubmissionFailed('Your cart is empty. Add items before checkout.'));
            return;
        }

        const totals = selectCartTotals(state);

        try {
            const order = await submitOrder({
                customer,
                items: mapLinesToOrder(lines),
                totals,
            });

            dispatch(orderSubmissionSucceeded(order));
            await persistState(STORAGE_KEYS.LAST_ORDER, order);
            await dispatch(clearCart());
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Payment could not be processed. Please try again.';

            dispatch(orderSubmissionFailed(message));
        }
    };

export const resetOrderStatus = () => (dispatch: AppDispatch) => {
    dispatch(orderStatusReset());
};
