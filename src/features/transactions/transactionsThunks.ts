import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/apiService";
import type { User } from "../../types";

export const fetchTransactions = createAsyncThunk(
    "transactions/fetchTransactions",
    async (user: User, { rejectWithValue }) => {
        const res = await api.getTransactions(user);
        if (!res.success) return rejectWithValue(res.message);
        return (res.data || []);
    }
);

export const createTransaction = createAsyncThunk(
    "transactions/createTransaction",
    async (
        { user, amount, type, toPhone }: { user: User; amount: number; type: string; toPhone?: string },
        { rejectWithValue }
    ) => {
        let res;

        if (type === "deposit") {
            res = await api.depositFunds(user, amount);
        } else if (type === "withdraw") {
            res = await api.withdrawFunds(user, amount);
        } else if (type === "transfer" && toPhone) {
            res = await api.transferFunds(user, toPhone, amount);
        } else {
            return rejectWithValue("סוג טרנזקציה לא חוקי");
        }

        if (!res.success) return rejectWithValue(res.message);
        return res.data || {};

    }
);
