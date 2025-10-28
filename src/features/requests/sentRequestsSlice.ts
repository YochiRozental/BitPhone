import { createSlice } from "@reduxjs/toolkit";
import { getSentPaymentRequests } from "./sentRequestsThunks";

interface PaymentRequest {
  id: number;
  requester_phone: string;
  recipient_phone: string;
  request_date: string;
  recipient_name: string;
  amount: string;
  status?: string;
  date?: string;
}

interface SentRequestsState {
  list: PaymentRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: SentRequestsState = {
  list: [],
  loading: false,
  error: null,
};

const sentRequestsSlice = createSlice({
  name: "sentRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSentPaymentRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSentPaymentRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getSentPaymentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sentRequestsSlice.reducer;
