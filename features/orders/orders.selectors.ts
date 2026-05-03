import { RootState } from '@/store/store';

export const selectLatestOrder = (state: RootState) => state.orders.latestOrder;