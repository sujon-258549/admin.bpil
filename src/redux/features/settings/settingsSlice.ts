import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  soundEnabled: boolean;
  notificationSound: string;
}

const initialState: SettingsState = {
  soundEnabled: true,
  notificationSound: "/sounds/messenger.wav", // default sound
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    setNotificationSound: (state, action: PayloadAction<string>) => {
      state.notificationSound = action.payload;
    },
  },
});

export const { setSoundEnabled, setNotificationSound } = settingsSlice.actions;

export default settingsSlice.reducer;
