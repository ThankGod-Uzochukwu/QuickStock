import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { APP_INITIAL_STATE, setAttendance, setSoftLoading, setUser } from "./slices/AppReducer";

export const noAction = (): null => null;

export const loadProfile = createAsyncThunk<void, void, { state: RootState }>(
    "app/profile",
    async (_, { dispatch, getState }) => {
        const { user } = getState().App;

        dispatch(setSoftLoading(true));
        try {
            if (user && Object.keys(user).length > 0) {
                dispatch(setUser(user));
            }
        } finally {
            dispatch(setSoftLoading(false));
        }
    },
);

export const loadApprovalRequests = createAsyncThunk<void, void>(
    "app/approvals",
    async () => {
        return;
    },
);

export const loadMyData = () => loadProfile();

export const loadAttendanceByMonth = createAsyncThunk<void, void, { state: RootState }>(
    "app/attendance",
    async (_, { dispatch, getState }) => {
        const { attendance, month } = getState().App;

        dispatch(setSoftLoading(true));
        try {
            dispatch(
                setAttendance({
                    ...attendance,
                    days: attendance.days,
                }),
            );

            if (!month) {
                dispatch(
                    setAttendance({
                        ...APP_INITIAL_STATE.attendance,
                    }),
                );
            }
        } finally {
            dispatch(setSoftLoading(false));
        }
    },
);
