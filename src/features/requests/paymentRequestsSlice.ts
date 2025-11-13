import { createSlice } from "@reduxjs/toolkit";
import type { RequestItem } from "../../types";
import {
    fetchIncomingRequests,
    fetchSentRequests,
    respondToRequest,
    sendPaymentRequest,
} from "./paymentRequestsThunks";

interface RequestsState {
    incoming: RequestItem[];
    sent: RequestItem[];
    loading: boolean;
    error: string | null;
}

const initialState: RequestsState = {
    incoming: [],
    sent: [],
    loading: false,
    error: null,
};

const paymentRequestsSlice = createSlice({
    name: "paymentRequests",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // incoming
            .addCase(fetchIncomingRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncomingRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.incoming = action.payload;
            })
            .addCase(fetchIncomingRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // sent
            .addCase(fetchSentRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSentRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.sent = action.payload;
            })
            .addCase(fetchSentRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // respond
            .addCase(respondToRequest.fulfilled, (state, action) => {
                const { requestId, status } = action.payload;
                const item = state.incoming.find((r) => r.id === requestId);
                if (item) item.status = status as "approved" | "rejected";
            })

            // send
            .addCase(sendPaymentRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendPaymentRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.sent.unshift(action.payload);
            })
            .addCase(sendPaymentRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default paymentRequestsSlice.reducer;
