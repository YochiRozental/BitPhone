import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/authApi";
import type { User } from "../../types";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: Pick<User, "phone" | "idNum" | "secret">, { rejectWithValue }) => {
    const res = await api.authenticateUser(userData.phone, userData.idNum, userData.secret);
    if (!res.success) return rejectWithValue(res.message);
    const user: User = {
      phone: userData.phone,
      idNum: userData.idNum,
      secret: userData.secret,
      name: res.data?.name || "",
      bankAccount: {
        accountNumber: res.data?.accountNumber || "",
        bankNumber: res.data?.bankNumber || "",
        branchNumber: res.data?.branchNumber || "",
        accountOwner: res.data?.accountOwner || res.data?.name || "",
      },
      balance: res.data?.balance?.toString() || "0",
      role: res.data?.role || "user",
    };

    return user;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: User, { rejectWithValue }) => {
    const res = await api.openAccount(
      userData.phone,
      userData.idNum,
      userData.secret,
      userData.name,
      userData.bankAccount.bankNumber,
      userData.bankAccount.branchNumber,
      userData.bankAccount.accountNumber
    );
    if (!res.success) return rejectWithValue(res.message);
    const savedUser: User = {
      ...userData,
      balance: res.data?.balance?.toString() || "0",
      role: res.data?.role || "user",
    };

    localStorage.setItem("user", JSON.stringify(savedUser));
    return savedUser;
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (updateData: Partial<User>, { getState, rejectWithValue }) => {
    const state: any = getState();
    const user = state.auth.user;

    if (!user) return rejectWithValue("משתמש לא מחובר");

    const res = await api.updateUser({ ...user, ...updateData });

    if (!res.success) return rejectWithValue(res.message);

    return { ...user, ...updateData };
  }
);
