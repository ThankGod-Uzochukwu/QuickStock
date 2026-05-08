import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InfoState {
    wallet: Record<string, unknown>;
    currency: unknown[];
    notifications: Record<string, unknown>;
    currencyPair: unknown[];
    currencies: unknown[];
    profile: Record<string, unknown>;
}

const initialState: InfoState = {
    wallet: {},
    currency: [],
    notifications: {},
    currencyPair: [],
    currencies: [],
    profile: {},
};

const infoSlice = createSlice({
    name: "info",
    initialState,
    reducers: {
        setWallet(state, action: PayloadAction<Record<string, unknown>>) {
            state.wallet = action.payload;
        },

        updateInfo(state, action: PayloadAction<Partial<InfoState>>) {
            Object.assign(state, action.payload);
        },
    },
});

export const { setWallet, updateInfo } = infoSlice.actions;

export default infoSlice.reducer;
