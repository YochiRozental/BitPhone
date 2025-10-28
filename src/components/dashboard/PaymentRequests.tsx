import { useEffect, useState } from "react";
import * as api from "../../api/apiService";
import PaymentRequestsTable from "./PaymentRequestsTable";
import type { User, RequestItem } from "../../types";

export default function PaymentRequestsList({ user }: { user: User }) {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await api.getPaymentRequests(user);
    if (res.success && Array.isArray(res.requests)) {
      const formatted: RequestItem[] = res.requests.map((r: any) => ({
        id: r.id,
        status: (r.status as "pending" | "approved" | "rejected") || "pending",
        date: r.transaction_date,
        name: r.requester_name,
        phone: r.requester_phone,
        amount: r.amount,
      }));
      setRequests(formatted);
    } else {
      setError(res.message || "שגיאה");
    }
    setLoading(false);
  };

  const handleApprove = async (id: number) => {
    await api.approvePayment(user, id);
    fetchRequests();
  };

  const handleReject = async (id: number) => {
    await api.rejectPayment(user, id);
    fetchRequests();
  };

  return (
    <PaymentRequestsTable
      title="בקשות תשלום נכנסות"
      requests={requests}
      loading={loading}
      error={error}
      showActions
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
