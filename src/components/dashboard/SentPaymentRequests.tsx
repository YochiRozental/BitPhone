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
    ButtonBase,
} from "@mui/material";
import { motion } from "framer-motion";
import * as api from "../../api/apiService";
import type { User, ApiResponse } from "../../types";

type SentRequest = {
    id: number;
    amount: string;
    recipient_phone: string;
    recipient_name?: string;
    status: string;
    transaction_date?: string;
};

export default function SentPaymentRequests({ user }: { user: User }) {
    const [requests, setRequests] = useState<SentRequest[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    useEffect(() => {
        fetchSentRequests();
    }, [user.phone, user.idNum, user.secret]);

    const fetchSentRequests = async () => {
        setLoading(true);
        setError("");

        try {
            const res: ApiResponse<{ sentRequests: any[] }> = await api.getSentPaymentRequests(user);

            const rawRequests = (res as any).sentRequests || res.data?.sentRequests || [];

            if (res.success && Array.isArray(rawRequests)) {
                const mappedRequests: SentRequest[] = rawRequests.map((r: any) => ({
                    id: r.id ?? r.request_id ?? 0,
                    amount: r.amount?.toString() ?? "0",
                    recipient_phone: r.recipient_phone ?? r.phone ?? "",
                    recipient_name: r.recipient_name ?? r.name ?? "",
                    status: r.status ?? "pending",
                    transaction_date: r.transaction_date ?? r.date ?? r.created_at ?? "",
                }));

                setRequests(mappedRequests);
            } else {
                setRequests([]);
                setError("אין בקשות תשלום ששלחת.");
            }
        } catch (err) {
            console.error("שגיאה בטעינת בקשות ששלחתי:", err);
            setError("שגיאה בטעינת בקשות התשלום ששלחת.");
        }

        setLoading(false);
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
        return <Typography textAlign="center">לא שלחת בקשות תשלום</Typography>;

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
                    { key: "approved", label: "אושרו", color: "#2e7d32" },
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
                                <span>{label}</span>
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
                            שם מקבל
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            טלפון מקבל
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                            סכום
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
                            <TableCell align="center">{req.recipient_name || "לא צוין שם"}</TableCell>
                            <TableCell align="center">{req.recipient_phone}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                ₪ {req.amount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
