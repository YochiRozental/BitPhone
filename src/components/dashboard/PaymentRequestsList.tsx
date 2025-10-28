import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
  Stack,
  ButtonBase,
} from "@mui/material";
import { motion } from "framer-motion";
import * as api from "../../api/apiService";
import type { User, ApiResponse } from "../../types";

type PaymentRequest = {
  id: number;
  amount: string;
  requester_phone: string;
  requester_name?: string;
  status: string;
  transaction_date?: string;
};

export default function PaymentRequests({ user }: { user: User }) {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    fetchRequests();
  }, [user.phone, user.idNum, user.secret]);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const res: ApiResponse<{ requests: any[] }> = await api.getPaymentRequests(user);

      const rawRequests = (res as any).requests || res.data?.requests || [];

      if (res.success && Array.isArray(rawRequests)) {
        const mappedRequests: PaymentRequest[] = rawRequests.map((r: any) => ({
          id: r.id ?? r.request_id ?? 0,
          amount: r.amount?.toString() ?? "0",
          requester_phone: r.requester_phone ?? r.phone ?? "",
          requester_name: r.requester_name ?? r.name ?? "",
          status: r.status ?? "pending",
          transaction_date: r.transaction_date ?? r.date ?? r.created_at ?? "",
        }));

        setRequests(mappedRequests);
      } else {
        setRequests([]);
        setError("אין בקשות תשלום להצגה.");
      }
    } catch (err) {
      console.error("שגיאה בטעינת בקשות:", err);
      setError("שגיאה בטעינת בקשות התשלום.");
    }

    setLoading(false);
  };

  const handleAction = async (requestId: number, action: "approve" | "reject") => {
    setProcessingId(requestId);
    try {
      const fn = action === "approve" ? api.approvePayment : api.rejectPayment;
      const res = await fn(user, requestId);

      if (res.success) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: action === "approve" ? "approved" : "rejected" }
              : r
          )
        );
      } else {
        alert(res.message || "פעולה נכשלה");
      }
    } catch {
      alert("שגיאה בביצוע הפעולה");
    }
    setProcessingId(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );

  if (!requests.length)
    return <Typography textAlign="center">אין בקשות תשלום להצגה</Typography>;

  return (
    <Paper sx={{ overflow: "hidden", direction: "rtl", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderRadius: 4,
          mb: 3,
          background: "linear-gradient(90deg, #f5f7fa 0%, #e3f2fd 100%)",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        {[
          { key: "all", label: "הצג הכל", color: "#1976d2" },
          { key: "pending", label: "ממתינים", color: "#f9a825" },
          { key: "approved", label: "מאושרים", color: "#2e7d32" },
          { key: "rejected", label: "נדחו", color: "#d32f2f" },
        ].map(({ key, label, color }) => {
          const count = counts[key as keyof typeof counts];
          const showCount = key === "pending" && count > 0;
          return (
            <ButtonBase
              key={key}
              onClick={() => setFilter(key as any)}
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              sx={{
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: "9999px",
                  border: `1.5px solid ${color}`,
                  color: filter === key ? "white" : color,
                  backgroundColor: filter === key ? color : "white",
                  fontWeight: "bold",
                  transition: "0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>{label}</span>

                {showCount && (
                  <Box
                    sx={{
                      backgroundColor: "white",
                      color: color,
                      borderRadius: "9999px",
                      px: 1,
                      minWidth: 22,
                      fontSize: 13,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {count}
                  </Box>
                )}
              </Box>
            </ButtonBase>
          );
        })}

      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              סטטוס
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              תאריך בקשה
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              שם מבקש
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              טלפון מבקש
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              סכום מבוקש
            </TableCell>

            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              פעולות
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRequests.map((req) => (
            <TableRow key={req.id}>
              <TableCell align="center">
                <Chip
                  label={
                    req.status === "pending"
                      ? "ממתין"
                      : req.status === "approved"
                        ? "אושר"
                        : "נדחה"
                  }
                  color={
                    req.status === "pending"
                      ? "warning"
                      : req.status === "approved"
                        ? "success"
                        : "error"
                  }
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell align="center">{formatDate(req.transaction_date)}</TableCell>
              <TableCell align="center">{req.requester_name || "לא צוין שם"}</TableCell>
              <TableCell align="center">{req.requester_phone}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                ₪ {req.amount}
              </TableCell>
              <TableCell align="center">
                {req.status === "pending" ? (
                  <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={2}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, "approve")}
                      sx={{
                        background: "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
                        borderRadius: "9999px",
                        fontWeight: "bold",
                        px: 2.5,
                        py: 0.5,
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        transition: "0.3s",
                        "&:hover": {
                          background: "linear-gradient(90deg, #43a047 0%, #81c784 100%)",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {processingId === req.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        "אשר"
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, "reject")}
                      sx={{
                        background: "linear-gradient(90deg, #e53935 0%, #ef5350 100%)",
                        borderRadius: "9999px",
                        fontWeight: "bold",
                        px: 2.5,
                        py: 0.5,
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        transition: "0.3s",
                        "&:hover": {
                          background: "linear-gradient(90deg, #c62828 0%, #e57373 100%)",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {processingId === req.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        "דחה"
                      )}
                    </Button>
                  </Stack>


                ) : (
                  <Typography variant="body2" color="text.secondary">
                    אין פעולות זמינות
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
