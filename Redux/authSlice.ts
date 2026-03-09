import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  _id: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  _id: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; _id?: string }>,
    ) => {
      state.user = action.payload.user;
      state._id = action.payload._id || action.payload.user._id;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state._id = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      localStorage.removeItem("user");
      // Optional: clear other stored items if they exist
    },
  },
});

export const { loginSuccess, logout, setInitialized } = authSlice.actions;
export default authSlice.reducer;
