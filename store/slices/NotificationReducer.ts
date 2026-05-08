import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorPayload {
    error?: string;
    errors?: Record<string, unknown> | null;
}

interface MessagePayload {
    message: string;
    type: string;
}

export interface NotificationState {
    showNotifier: boolean;
    notificationMsg: string;
    notificationType: string;
    error: string | null;
    errors: Record<string, unknown> | null;
}

const initialState: NotificationState = {
    showNotifier: false,
    notificationMsg: "",
    notificationType: "",
    error: null,
    errors: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setError(state, action: PayloadAction<ErrorPayload | string | undefined>) {
            const payload = action.payload;
            const nextError = typeof payload === "string" ? payload : payload?.error || "";
            const nextErrors =
                typeof payload === "object" && payload ? (payload.errors ?? null) : null;

            state.error = nextError;
            state.errors = nextErrors;
            state.showNotifier = Boolean(nextError);
            state.notificationMsg = nextError;
            state.notificationType = "error";
        },

        setErrors(state, action: PayloadAction<Record<string, unknown> | null>) {
            state.errors = action.payload;
        },

        setMessage(state, action: PayloadAction<MessagePayload>) {
            state.showNotifier = true;
            state.notificationMsg = action.payload.message;
            state.notificationType = action.payload.type;
        },

        clearMessage(state) {
            state.showNotifier = false;
            state.notificationMsg = "";
            state.notificationType = "";
        },
    },
});

export const { setError, setMessage, setErrors, clearMessage } = notificationSlice.actions;

export default notificationSlice.reducer;
