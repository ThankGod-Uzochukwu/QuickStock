import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";
import type { AuthUser } from "@/types/auth";
import { setError, setErrors } from "./NotificationReducer";

interface AttendanceState {
    days: number;
    overtime: number;
    on_time: number;
    late: number;
    absent: number;
    off_days: number;
    leaves: number;
}

interface LoginDraft {
    email: string;
    password: string;
}

export interface AppState {
    isLoading: boolean;
    isSoftLoading: boolean;
    token: string;
    cameraNote: string;
    locale: string;
    rtl: boolean;
    openLanguage: boolean;
    user: Partial<AuthUser>;
    isLoggedIn: boolean;
    firstTimeUser: "yes" | "no";
    isFirstTime: boolean;
    isConnected: boolean | null;
    error: string | null;
    errors: Record<string, unknown> | null;
    terms: boolean;
    loadingMessage: string;
    login: LoginDraft;
    refresh: string;
    attendance: AttendanceState;
    month: string;
    approvals: unknown[];
}

export const APP_INITIAL_STATE: AppState = {
    isLoading: false,
    isSoftLoading: false,
    token: "",
    cameraNote: "show",
    locale: "en",
    rtl: false,
    openLanguage: false,
    user: {},
    isLoggedIn: false,
    firstTimeUser: "yes",
    isFirstTime: true,
    isConnected: null,
    error: null,
    errors: null,
    terms: true,
    loadingMessage: "Please Wait...",
    login: { email: "", password: "" },
    refresh: "",
    attendance: {
        days: 0,
        overtime: 0,
        on_time: 0,
        late: 0,
        absent: 0,
        off_days: 0,
        leaves: 0,
    },
    month: format(new Date(), "MMMM y"),
    approvals: [],
};

const stateLogout = (state: AppState) => {
    state.error = "Your authentication expired";
    state.user = {};
    state.refresh = "";
    state.token = "";
    state.isLoggedIn = false;
};

const appSlice = createSlice({
    name: "app",
    initialState: APP_INITIAL_STATE,
    reducers: {
        startLoading(state, action: PayloadAction<string | undefined>) {
            state.isLoading = true;
            state.loadingMessage = action.payload || "Please Wait...";
        },

        softLoading(state) {
            state.isSoftLoading = true;
        },

        saveFirstTime(state) {
            state.firstTimeUser = "no";
            state.isFirstTime = false;
        },

        stopLoading(state) {
            state.isLoading = false;
            state.isSoftLoading = false;
            state.loadingMessage = "Please Wait...";
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },

        setSoftLoading(state, action: PayloadAction<boolean>) {
            state.isSoftLoading = action.payload;
        },

        setUser(state, action: PayloadAction<Partial<AuthUser>>) {
            state.isLoading = false;
            state.user = action.payload;
        },

        setAttendance(state, action: PayloadAction<AttendanceState>) {
            state.isLoading = false;
            state.attendance = action.payload;
        },

        setMonth(state, action: PayloadAction<string>) {
            state.month = action.payload;
        },

        setLocale(state, action: PayloadAction<string>) {
            state.locale = action.payload;
            state.rtl = ["ar"].includes(action.payload);
            state.openLanguage = false;
        },

        setToken(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.token = action.payload;
            state.isLoggedIn = Boolean(action.payload);
        },

        setLogin(state, action: PayloadAction<LoginDraft>) {
            state.login = action.payload;
        },

        setAppState(state, action: PayloadAction<Partial<AppState>>) {
            const payload = action.payload;
            Object.entries(payload).forEach(([key, value]) => {
                (state as unknown as Record<string, unknown>)[key] = value as unknown;
            });
        },

        setRefresh(state, action: PayloadAction<string>) {
            state.refresh = action.payload;
        },

        setOpenLanguage(state, action: PayloadAction<boolean>) {
            state.openLanguage = action.payload;
        },

        logout: stateLogout,
    },
    extraReducers: (builder) => {
        builder.addCase(setError, (state) => {
            state.isLoading = false;
        });
        builder.addCase(setErrors, (state) => {
            state.isLoading = false;
        });
    },
});

export const {
    setUser,
    setAttendance,
    setMonth,
    startLoading,
    softLoading,
    setSoftLoading,
    setToken,
    stopLoading,
    setOpenLanguage,
    saveFirstTime,
    setAppState,
    logout,
    setRefresh,
    setLocale,
    setLogin,
    setLoading,
} = appSlice.actions;

export default appSlice.reducer;
