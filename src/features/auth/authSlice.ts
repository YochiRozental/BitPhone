import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";
import { loginUser, registerUser, updateUser, fetchBalance } from "./authThunks";

interface AuthState {
  user: User | null;
  balance: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  balance: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload || null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
