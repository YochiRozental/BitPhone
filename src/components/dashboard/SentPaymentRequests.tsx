import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    ButtonBase,
} from "@mui/material";
import { motion } from "framer-motion";
import { getSentPaymentRequests } from "../../features/requests/sentRequestsThunks";
import type { User } from "../../types";
import type { RootState, AppDispatch } from "../../app/store";

export default function SentPaymentRequests({ user }: { user: User }) {
    const dispatch = useDispatch<AppDispatch>();
    const { list: requests, loading, error } = useSelector(
        (state: RootState) => state.sentRequests
    );

    useEffect(() => {
        dispatch(getSentPaymentRequests(user));
    }, [dispatch, user.phone, user.idNum, user.secret]);

    const [filter, setFilter] = useState<
        "all" | "pending" | "approved" | "rejected"
    >("all");

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
                            תאריך הבקשה
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
                            <TableCell align="center">{formatDate(req.request_date)}</TableCell>
                            <TableCell align="center">{req.recipient_name || "לא צוין שם"}</TableCell>
                            <TableCell align="center">{req.recipient_phone}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                {req.amount} ₪
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
