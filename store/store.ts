import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/products.slice';

/**
 * Configure the Redux store
 */
export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        // (needed if we ever dispatch functions or dates)
        ignoredActions: [],
      },
    }),
  devTools: __DEV__,
});

/**
 * Type definitions for TypeScript integration
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
