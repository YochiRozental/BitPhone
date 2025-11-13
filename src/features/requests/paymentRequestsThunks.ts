import { createAsyncThunk } from "@reduxjs/toolkit";
import * as userApi from "../../api/userApi";
import * as paymentsApi from "../../api/paymentsApi";
import type { User, RequestItem } from "../../types";

// פונקציה מנרמלת את הנתונים
const normalizeRequest = (r: any, type: "incoming" | "sent"): RequestItem => ({
    id: r.id,
    status: (r.status as "pending" | "approved" | "rejected") || "pending",
    date: r.transaction_date || r.request_date || "",
    name: type === "incoming" ? r.requester_name : r.recipient_name,
    phone: type === "incoming" ? r.requester_phone : r.recipient_phone,
    amount: String(Number(r.amount) || 0),
});

// thunk לשליפת בקשות נכנסות
export const fetchIncomingRequests = createAsyncThunk(
    "requests/fetchIncoming",
    async (user: User, { rejectWithValue }) => {
        const res = await userApi.getPaymentRequests(user);
        if (!res.success) return rejectWithValue(res.message);
        return (res.requests || []).map((r: any) => normalizeRequest(r, "incoming"));
    }
);

// thunk לשליפת בקשות שנשלחו
export const fetchSentRequests = createAsyncThunk(
    "requests/fetchSent",
    async (user: User, { rejectWithValue }) => {
        const res = await userApi.getSentPaymentRequests(user);
        if (!res.success) return rejectWithValue(res.message);
        return (res.requests || []).map((r: any) => normalizeRequest(r, "sent"));
    }
);

// thunk לאישור / דחייה
export const respondToRequest = createAsyncThunk(
    "requests/respond",
    async (
        { user, requestId, accept }: { user: User; requestId: number; accept: boolean },
        { rejectWithValue }
    ) => {
        const res = await paymentsApi.respondToPaymentRequest(user, requestId, accept);
        if (!res.success) return rejectWithValue(res.message);
        return { requestId, status: accept ? "approved" : "rejected" };
    }
);

// thunk לשליחת בקשה חדשה
export const sendPaymentRequest = createAsyncThunk(
    "requests/send",
    async (
        {
            user,
            recipientPhone,
            amount,
        }: { user: User; recipientPhone: string; amount: number },
        { rejectWithValue }
    ) => {
        const res = await paymentsApi.requestPayment(user, recipientPhone, amount);
        if (!res.success) return rejectWithValue(res.message);
        return normalizeRequest(res.request, "sent");
    }
);
