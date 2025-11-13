import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncomingRequests,
  respondToRequest,
} from "../../features/requests/paymentRequestsThunks";
import PaymentRequestsTable from "../tables/PaymentRequestsTable";
import type { User } from "../../types";
import type { RootState, AppDispatch } from "../../app/store";

export default function PaymentRequests({ user }: { user: User }) {
  const dispatch = useDispatch<AppDispatch>();
  const { incoming: requests, loading, error } = useSelector(
    (state: RootState) => state.requests
  );

  useEffect(() => {
    dispatch(fetchIncomingRequests(user));
  }, [dispatch, user]);

  const handleApprove = (id: number) =>
    dispatch(respondToRequest({ user, requestId: id, accept: true }));

  const handleReject = (id: number) =>
    dispatch(respondToRequest({ user, requestId: id, accept: false }));

  return (
    <PaymentRequestsTable
      requests={requests}
      loading={loading}
      error={error}
      showActions
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
