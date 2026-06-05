import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  soundEnabled: boolean;
  notificationSound: string;
  volume: number;
}

const initialState: SettingsState = {
  soundEnabled: true,
  notificationSound: "/sounds/messenger.wav", // default sound
  volume: 1.0, // max volume by default
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
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
});

export const { setSoundEnabled, setNotificationSound, setVolume } = settingsSlice.actions;

export default settingsSlice.reducer;
