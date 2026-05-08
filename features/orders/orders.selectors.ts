import { RootState } from '@/store/store';

export const selectOrderStatus = (state: RootState) => state.orders.status;
export const selectOrderError = (state: RootState) => state.orders.error;
export const selectLastOrder = (state: RootState) => state.orders.lastOrder;
