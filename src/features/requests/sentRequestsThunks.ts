import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/apiService";
import type { User } from "../../types";

export const getSentPaymentRequests = createAsyncThunk(
  "sentRequests/getSentPaymentRequests",
  async (user: User, { rejectWithValue }) => {
    const res = await api.getSentPaymentRequests(user);
    if (!res.success) return rejectWithValue(res.message);
    return res.requests || [];
  }
);
