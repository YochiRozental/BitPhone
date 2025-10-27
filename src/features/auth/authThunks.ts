import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/apiService";
import type { User } from "../../types";

// התחברות משתמש קיים
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: Pick<User, "phone" | "idNum" | "secret">, { rejectWithValue }) => {
    const res = await api.authenticateUser(userData.phone, userData.idNum, userData.secret);
    if (!res.success) return rejectWithValue(res.message);
    return { ...userData, name: res.data?.name || "" };
  }
);

// פתיחת חשבון חדש
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: User, { rejectWithValue }) => {
    const res = await api.openAccount(userData.phone, userData.idNum, userData.secret, userData.name || "");
    if (!res.success) return rejectWithValue(res.message);
    return userData;
  }
);

// בדיקת יתרה
export const fetchBalance = createAsyncThunk(
  "auth/fetchBalance",
  async (user: User, { rejectWithValue }) => {
    const res = await api.checkBalance(user);
    if (!res.success) return rejectWithValue(res.message);
    return res.balance;
  }
);
