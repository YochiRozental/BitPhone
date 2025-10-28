import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import requestsReducer from "../features/requests/requestsSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import sentRequestsReducer from "../features/requests/sentRequestsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    sentRequests: sentRequestsReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
