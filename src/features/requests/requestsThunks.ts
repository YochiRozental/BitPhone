import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/apiService";
import type { User } from "../../types";

export const getIncomingRequests = createAsyncThunk(
    "requests/getIncomingRequests",
    async (user: User, { rejectWithValue }) => {
        const res = await api.getPaymentRequests(user);
        if (!res.success) return rejectWithValue(res.message);
        return (res.requests || []) as any[];
    }
);

export const createPaymentRequest = createAsyncThunk(
    "requests/createPaymentRequest",
    async (
        { fromUser, toPhone, amount }: { fromUser: User; toPhone: string; amount: number },
        { rejectWithValue }
    ) => {
        const res = await api.requestPayment(fromUser, toPhone, amount);
        if (!res.success) return rejectWithValue(res.message);
        return res.request || res.data;
    }
);

export const respondToPaymentRequest = createAsyncThunk(
    "requests/respondToPaymentRequest",
    async (
        { user, requestId, accept }: { user: User; requestId: number; accept: boolean },
        { rejectWithValue }
    ) => {
        const res = await api.respondToPaymentRequest(user, requestId, accept);
        if (!res.success) return rejectWithValue(res.message);
        return { requestId, status: accept ? "accepted" : "rejected" };
    }
);
