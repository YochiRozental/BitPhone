import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import requestsReducer from "../features/requests/paymentRequestsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
