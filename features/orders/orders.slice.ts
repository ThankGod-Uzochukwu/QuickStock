import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from './types';

export type OrderStatus = 'idle' | 'submitting' | 'succeeded' | 'failed';

export interface OrdersState {
    status: OrderStatus;
    error: string | null;
    lastOrder: Order | null;
}

const initialState: OrdersState = {
    status: 'idle',
    error: null,
    lastOrder: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        orderSubmissionStarted(state) {
            state.status = 'submitting';
            state.error = null;
        },
        orderSubmissionSucceeded(state, action: PayloadAction<Order>) {
            state.status = 'succeeded';
            state.lastOrder = action.payload;
            state.error = null;
        },
        orderSubmissionFailed(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        orderStatusReset(state) {
            state.status = 'idle';
            state.error = null;
        },
        orderHydrated(state, action: PayloadAction<Order | null>) {
            state.lastOrder = action.payload;
        },
    },
});

export const {
    orderSubmissionStarted,
    orderSubmissionSucceeded,
    orderSubmissionFailed,
    orderStatusReset,
    orderHydrated,
} = ordersSlice.actions;

export default ordersSlice.reducer;
