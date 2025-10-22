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
} from "@mui/material";
import * as api from "../api/apiService";
import type { User, Transaction, ApiResponse } from "../types";

export default function TransactionHistory({ user }: { user: User }) {
    const [history, setHistory] = useState<Transaction[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError("");
            setHistory([]);

            const res: ApiResponse = await api.getTransactionHistory(user);
            const fullResponse = res as any;

            if (res.success) {
                let transactions: Transaction[] = [];

                if (Array.isArray(fullResponse.history)) {
                    transactions = fullResponse.history as Transaction[];
                } else {
                    setError("המערכת לא זיהתה את מבנה נתוני ההיסטוריה.");
                }

                transactions = transactions.filter(item => typeof item === 'object' && item !== null);

                setHistory(transactions);
            } else {
                setError(res.message || "שגיאה בטעינת היסטוריית פעולות.");
            }

            setLoading(false);
        };
        fetchHistory();
    }, [user.phone, user.idNum, user.secret]);

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

    if (!history.length)
        return <Typography textAlign="center">אין תנועות להצגה</Typography>;

    return (
        <Paper sx={{ overflow: "hidden" }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                        <TableCell align="center">תאריך</TableCell>
                        <TableCell align="center">תיאור</TableCell>
                        <TableCell align="center">סכום</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {history.map((tx, i) => (
                        <TableRow key={i}>
                            <TableCell align="center">
                                {new Date(tx.transaction_date).toLocaleString("he-IL")}
                            </TableCell>
                            <TableCell align="center">{tx.description}</TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    color: tx.action_type.includes("deposit") || tx.action_type.includes("received") ? "green" : "red",
                                    fontWeight: "bold",
                                }}
                            >
                                {tx.amount} ₪
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}