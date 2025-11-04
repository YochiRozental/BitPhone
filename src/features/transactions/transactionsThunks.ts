import { createAsyncThunk } from "@reduxjs/toolkit";
import * as paymentsApi from "../../api/paymentsApi";
import * as userApi from "../../api/userApi";

import type { User } from "../../types";

export const fetchTransactions = createAsyncThunk(
    "transactions/fetchTransactions",
    async (user: User, { rejectWithValue }) => {
        const res = await userApi.getTransactions(user);
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
            res = await paymentsApi.depositFunds(user, amount);
        } else if (type === "withdraw") {
            res = await paymentsApi.withdrawFunds(user, amount);
        } else if (type === "transfer" && toPhone) {
            res = await paymentsApi.transferFunds(user, toPhone, amount);
        } else {
            return rejectWithValue("סוג טרנזקציה לא חוקי");
        }

        if (!res.success) return rejectWithValue(res.message);
        return res.data || {};

    }
);
