import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions, createTransaction } from "./transactionsThunks";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
  fromName: string;
  toName: string;
}

interface TransactionsState {
  list: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  list: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export default transactionsSlice.reducer;
