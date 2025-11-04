import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/userApi";
import type { User } from "../../types";

export const getSentPaymentRequests = createAsyncThunk(
  "sentRequests/getSentPaymentRequests",
  async (user: User, { rejectWithValue }) => {
    try {
      const res = await api.getSentPaymentRequests(user);

      if (!res.success) return rejectWithValue(res.message || "שגיאה כללית");

      const requests =
        (res as any).requests ||
        res.data?.sentRequests ||
        [];

      return Array.isArray(requests) ? requests : [];
    } catch (err: any) {
      console.error("שגיאה בשליפת בקשות ששלחתי:", err);
      return rejectWithValue("שגיאת תקשורת עם השרת.");
    }
  }
);
