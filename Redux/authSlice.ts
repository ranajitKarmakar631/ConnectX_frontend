import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  _id: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  _id: null,
  isAuthenticated: false,
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
    },
    logout: (state) => {
      state.user = null;
      state._id = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      // Optional: clear other stored items if they exist
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
