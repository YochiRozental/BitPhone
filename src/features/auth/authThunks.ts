import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/authApi";
import type { User } from "../../types";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: Pick<User, "phone" | "idNum" | "secret">, { rejectWithValue }) => {
    const res = await api.loginUser(userData.phone, userData.idNum, userData.secret);

    if (!res.success) return rejectWithValue(res.message);

    const serverUser = res.data;

    const user: User = {
      phone: userData.phone,
      idNum: userData.idNum,
      secret: userData.secret,
      name: serverUser.name || "",
      bankAccount: {
        accountNumber: serverUser.account_number || "",
        bankNumber: serverUser.bank_number || "",
        branchNumber: serverUser.branch_number || "",
        accountOwner: serverUser.account_holder_name || serverUser.name || "",
      },
      balance: serverUser.balance?.toString() || "0",
      role: serverUser.role || "user",
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
  async (user: User, { rejectWithValue }) => {
    try {
      const res = await api.updateUser(user)

      return {
        ...user,
        ...res.data,
      };
    } catch (err: any) {
      console.error("שגיאה ב-updateUser:", err);
      return rejectWithValue(err.message);
    }
  }
);
