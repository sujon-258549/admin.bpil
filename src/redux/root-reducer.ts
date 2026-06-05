import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "./features/auth/auth-slice"
import uiReducer from "./features/ui/ui-slice"
import settingsReducer from "./features/settings/settingsSlice"
import { baseApi } from "./api/base-api"

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  settings: settingsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

export type RootStateShape = ReturnType<typeof rootReducer>
