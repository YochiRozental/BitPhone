import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";
import requestsReducer from "../features/requests/paymentRequestsSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    transactions: transactionsReducer,
    requests: requestsReducer,
});

export default rootReducer;
