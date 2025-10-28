import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSentPaymentRequests } from "../../features/requests/sentRequestsThunks";
import PaymentRequestsTable from "./PaymentRequestsTable";
import type { User, RequestItem } from "../../types";
import type { RootState, AppDispatch } from "../../app/store";

export default function SentPaymentRequests({ user }: { user: User }) {
  const dispatch = useDispatch<AppDispatch>();
  const { list: requests, loading, error } = useSelector(
    (state: RootState) => state.sentRequests
  );

  useEffect(() => {
    dispatch(getSentPaymentRequests(user));
  }, [dispatch, user]);

  const formatted: RequestItem[] = requests.map((r) => ({
    id: r.id,
    status: (r.status as "pending" | "approved" | "rejected") || "pending",
    date: r.request_date,
    name: r.recipient_name,
    phone: r.recipient_phone,
    amount: r.amount,
  }));

  return (
    <PaymentRequestsTable
      title="בקשות תשלום ששלחתי"
      requests={formatted}
      loading={loading}
      error={error}
    />
  );
}
