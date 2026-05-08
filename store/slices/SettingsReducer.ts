import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocialHandles {
    facebook: string;
    instagram: string;
    linkedin: string;
    telegram: string;
    twitter: string;
}

export interface SettingsState {
    allow_biometric_login: boolean;
    email: string;
    available_countries: unknown;
    can_skip_kyc: boolean;
    issue_type: unknown;
    issue_types: unknown[];
    otp_type: unknown;
    privacy_policy_link: string;
    social_media_handle: SocialHandles;
    terms_link: string;
    verification_id_types: unknown;
    video_selfie_required: boolean;
}

const initialState: SettingsState = {
    allow_biometric_login: true,
    email: "deposit@sendnaa.app",
    available_countries: null,
    can_skip_kyc: true,
    issue_type: null,
    issue_types: [],
    otp_type: null,
    privacy_policy_link: "https://sendnaa.app/privacy_policy",
    social_media_handle: {
        facebook: "https://facebook/sendnaa",
        instagram: "https://facebook/sendnaa",
        linkedin: "https://facebook/sendnaa",
        telegram: "https://facebook/sendnaa",
        twitter: "https://facebook/sendnaa",
    },
    terms_link: "https://sendnaa.app/terms",
    verification_id_types: null,
    video_selfie_required: true,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings(_state, action: PayloadAction<SettingsState>) {
            return { ...action.payload };
        },
    },
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
