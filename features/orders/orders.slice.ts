import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderSummary } from '../products/types';

export interface OrdersState {
    latestOrder: OrderSummary | null;
}

const initialState: OrdersState = {
    latestOrder: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        orderConfirmed(state, action: PayloadAction<OrderSummary>) {
            state.latestOrder = action.payload;
        },
        orderCleared(state) {
            state.latestOrder = null;
        },
    },
});

export const { orderConfirmed, orderCleared } = ordersSlice.actions;

export default ordersSlice.reducer;