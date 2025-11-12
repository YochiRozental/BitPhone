import {
    Paper,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    CircularProgress,
    Typography,
    ButtonBase,
    Stack,
    Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import type { RequestItem } from "../../types";

interface PaymentRequestsTableProps {
    title?: string;
    requests: RequestItem[];
    loading?: boolean;
    error?: string | null;
    showActions?: boolean;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
}

export default function PaymentRequestsTable({
    title,
    requests,
    loading = false,
    error = null,
    showActions = false,
    onApprove,
    onReject,
}: PaymentRequestsTableProps) {
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    const filteredRequests =
        filter === "all" ? requests : requests.filter((r) => r.status === filter);

    const counts = {
        all: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        approved: requests.filter((r) => r.status === "approved").length,
        rejected: requests.filter((r) => r.status === "rejected").length,
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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
        return (
            <Typography textAlign="center" sx={{ mt: 2 }}>
                אין נתונים להצגה
            </Typography>
        );

    return (
        <Paper sx={{ overflow: "hidden", direction: "rtl", p: 3 }}>
            {title && (
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {title}
                </Typography>
            )}

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
                    { key: "approved", label: "מאושרים", color: "#2e7d32" },
                    { key: "rejected", label: "נדחו", color: "#d32f2f" },
                ].map(({ key, label, color }) => (
                    <ButtonBase
                        key={key}
                        onClick={() => setFilter(key as any)}
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        sx={{ borderRadius: "9999px" }}
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
                            }}
                        >
                            {label}
                            {key === "pending" && counts.pending > 0 && (
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        backgroundColor: "white",
                                        color,
                                        borderRadius: "9999px",
                                        px: 1,
                                        minWidth: 22,
                                        fontSize: 13,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {counts.pending}
                                </Box>
                            )}
                        </Box>
                    </ButtonBase>
                ))}
            </Box>

            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>סטטוס</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>תאריך</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>שם</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>טלפון</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>סכום</TableCell>
                        {showActions && (
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>פעולות</TableCell>
                        )}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filteredRequests.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell align="center">
                                <Chip
                                    label={
                                        r.status === "pending"
                                            ? "ממתין"
                                            : r.status === "approved"
                                                ? "אושר"
                                                : "נדחה"
                                    }
                                    color={
                                        r.status === "pending"
                                            ? "warning"
                                            : r.status === "approved"
                                                ? "success"
                                                : "error"
                                    }
                                    variant="outlined"
                                    size="small"
                                />
                            </TableCell>
                            <TableCell align="center">{formatDate(r.date)}</TableCell>
                            <TableCell align="center">{r.name || "לא צוין שם"}</TableCell>
                            <TableCell align="center">{r.phone}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                ₪ {r.amount}
                            </TableCell>

                            {showActions && (
                                <TableCell align="center">
                                    {r.status === "pending" ? (
                                        <Stack direction="row" justifyContent="center" spacing={1}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                onClick={() => onApprove?.(r.id)}
                                            >
                                                אשר
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                onClick={() => onReject?.(r.id)}
                                            >
                                                דחה
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            אין פעולות
                                        </Typography>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
