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
import type { User, Transaction } from "../types";

export default function TransactionHistory({ user }: { user: User }) {
    const [history, setHistory] = useState<Transaction[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await api.getTransactionHistory(user);
            if (res.success && res.data) setHistory(res.data);
            else setError(res.message);
            setLoading(false);
        })();
    }, [user]);

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
                                    color: tx.action_type.includes("in") ? "green" : "red",
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
