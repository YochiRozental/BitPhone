import { createSlice } from "@reduxjs/toolkit";
import {
  getIncomingRequests,
  createPaymentRequest,
  respondToPaymentRequest,
} from "./requestsThunks";
import type { ReactNode } from "react";

interface PaymentRequest {
  recipient_phone: ReactNode;
  id: number;
  fromName: string;
  toName: string;
  amount: number;
  status: string;
  date: string;
}

interface RequestsState {
  list: PaymentRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  list: [],
  loading: false,
  error: null,
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIncomingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIncomingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(getIncomingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPaymentRequest.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(respondToPaymentRequest.fulfilled, (state, action) => {
        const req = state.list.find((r) => r.id === action.payload.requestId);
        if (req) req.status = action.payload.status;
      });
  },
});

export default requestsSlice.reducer;
