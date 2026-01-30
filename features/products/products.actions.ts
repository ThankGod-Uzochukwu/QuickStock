import { selectIsProductLimitReached, selectProductsCount } from '../../features/products/products.selectors';
import { Product, PRODUCT_LIMITS } from '../../features/products/types';
import { notificationService } from '../../services/notifications/notification.adapter';
import { loadPersistedState, persistState } from '../../services/storage/persistence.service';
import { STORAGE_KEYS } from '../../services/storage/storage.adapter';
import { AppDispatch, RootState } from '../../store/store';
import { createProduct, updateProductData } from './product.service';
import {
    productAdded,
    productRemoved,
    productsErrorSet,
    productsHydrated,
    productUpdated,
} from './products.slice';

/**
 * Add a new product with full validation and side effects
 */
export const addProduct =
    (name: string, price: number, imageUri: string) =>
        async (dispatch: AppDispatch, getState: () => RootState) => {
            try {
                const state = getState();

                // Enforce limit at business logic level
                if (selectIsProductLimitReached(state)) {
                    dispatch(productsErrorSet('Product limit reached. Cannot add more products.'));
                    return;
                }

                // Validate and create product
                const result = createProduct(name, price, imageUri);

                if (!result.valid) {
                    dispatch(productsErrorSet(result.error));
                    return;
                }

                // Add to state
                dispatch(productAdded(result.data));

                // Persist to storage
                const updatedState = getState();
                await persistState(STORAGE_KEYS.PRODUCTS, updatedState.products.items);

                // Check if we just hit the limit
                const newCount = selectProductsCount(updatedState);
                if (newCount === PRODUCT_LIMITS.MAX_PRODUCTS) {
                    await notificationService.scheduleNotification(
                        'Product Limit Reached',
                        `You've added ${PRODUCT_LIMITS.MAX_PRODUCTS} products. This is the maximum allowed.`
                    );
                }
            } catch (error) {
                console.error('Failed to add product:', error);
                dispatch(productsErrorSet('Failed to add product. Please try again.'));
            }
        };

/**
 * Remove a product
 */
export const removeProduct =
    (productId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            dispatch(productRemoved(productId));

            // Persist to storage
            const state = getState();
            await persistState(STORAGE_KEYS.PRODUCTS, state.products.items);
        } catch (error) {
            console.error('Failed to remove product:', error);
            dispatch(productsErrorSet('Failed to remove product. Please try again.'));
        }
    };

/**
 * Update an existing product
 */
export const updateProduct =
    (productId: string, name: string, price: number, imageUri: string) =>
        async (dispatch: AppDispatch, getState: () => RootState) => {
            try {
                const state = getState();
                const existing = state.products.items.find((product) => product.id === productId);

                if (!existing) {
                    dispatch(productsErrorSet('Product not found.'));
                    return;
                }

                const result = updateProductData(existing, name, price, imageUri);

                if (!result.valid) {
                    dispatch(productsErrorSet(result.error));
                    return;
                }

                dispatch(productUpdated(result.data));

                const updatedState = getState();
                await persistState(STORAGE_KEYS.PRODUCTS, updatedState.products.items);
            } catch (error) {
                console.error('Failed to update product:', error);
                dispatch(productsErrorSet('Failed to update product. Please try again.'));
            }
        };

/**
 * Load products from storage on app start
 */
export const loadProducts = () => async (dispatch: AppDispatch) => {
    try {
        const products = await loadPersistedState<Product[]>(STORAGE_KEYS.PRODUCTS);

        if (products) {
            dispatch(productsHydrated(products));
        } else {
            dispatch(productsHydrated([]));
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        dispatch(productsHydrated([]));
    }
};

/**
 * Request notification permissions on app start
 */
export const initializeNotifications = () => async () => {
    try {
        await notificationService.requestPermissions();
    } catch (error) {
        console.error('Failed to initialize notifications:', error);
    }
};
