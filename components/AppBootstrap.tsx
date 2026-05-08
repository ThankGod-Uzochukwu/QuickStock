import { loadCart } from '@/features/cart/cart.actions';
import { loadLastOrder } from '@/features/orders/orders.actions';
import { initializeNotifications, loadProducts } from '@/features/products/products.actions';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';

export function AppBootstrap() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadProducts());
        dispatch(loadCart());
        dispatch(loadLastOrder());
        dispatch(initializeNotifications());
    }, [dispatch]);

    return null;
}
