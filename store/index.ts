import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { useSelector } from "react-redux";
import App from "./slices/AppReducer";
import Notification from "./slices/NotificationReducer";

const reducers = combineReducers({ App, Notification });
const persistConfig = { key: "test1", storage: AsyncStorage };
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export const dispatch: AppDispatch = store.dispatch;
export const getState = (): RootState => store.getState();

export const useAppState = <TNode extends keyof RootState = "App">(
    node: TNode = "App" as TNode,
): RootState[TNode] => useSelector((state: RootState) => state[node]);

export default store;
