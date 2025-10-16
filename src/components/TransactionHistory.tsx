// import { useEffect, useState } from "react";
// import {
//     Table,
//     TableHead,
//     TableRow,
//     TableCell,
//     TableBody,
//     Paper,
//     Typography,
//     Box,
//     CircularProgress,
// } from "@mui/material";
// import * as api from "../api/apiService";
// import type { User, Transaction } from "../types";

// export default function TransactionHistory({ user }: { user: User }) {
//     const [history, setHistory] = useState<Transaction[]>([]);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         (async () => {
//             const res = await api.getTransactionHistory(user);
//             if (res.success && res.data) setHistory(res.data);
//             else setError(res.message);
//             setLoading(false);
//         })();
//     }, [user]);

//     if (loading)
//         return (
//             <Box display="flex" justifyContent="center" my={3}>
//                 <CircularProgress />
//             </Box>
//         );

//     if (error)
//         return (
//             <Typography color="error" textAlign="center">
//                 {error}
//             </Typography>
//         );

//     if (!history.length)
//         return <Typography textAlign="center">אין תנועות להצגה</Typography>;

//     return (
//         <Paper sx={{ overflow: "hidden" }}>
//             <Table>
//                 <TableHead>
//                     <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
//                         <TableCell align="center">תאריך</TableCell>
//                         <TableCell align="center">תיאור</TableCell>
//                         <TableCell align="center">סכום</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {history.map((tx, i) => (
//                         <TableRow key={i}>
//                             <TableCell align="center">
//                                 {new Date(tx.transaction_date).toLocaleString("he-IL")}
//                             </TableCell>
//                             <TableCell align="center">{tx.description}</TableCell>
//                             <TableCell
//                                 align="center"
//                                 sx={{
//                                     color: tx.action_type.includes("in") ? "green" : "red",
//                                     fontWeight: "bold",
//                                 }}
//                             >
//                                 {tx.amount} ₪
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </Paper>
//     );
// }

// src/TransactionHistory.tsx

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

            // 1. קבלת התגובה הגולמית מה-API
            const res: ApiResponse = await api.getTransactionHistory(user);
            const fullResponse = res as any; // נשתמש ב-any כדי לגשת ל-'history'

            if (res.success) {
                // *** הלוגיקה הקריטית לתיקון: חילוץ ממפתח 'history' ***
                let transactions: Transaction[] = [];

                // 🛑 חילוץ ישיר ממפתח 'history' ברמה העליונה של האובייקט
                if (Array.isArray(fullResponse.history)) {
                    transactions = fullResponse.history as Transaction[];
                } else {
                    // אם השרת מחזיר בהצלחה אבל לא מכיל את 'history' (מצב מוזר)
                    setError("המערכת לא זיהתה את מבנה נתוני ההיסטוריה.");
                }

                // ודא שכל הנתונים הם אובייקטים חוקיים
                transactions = transactions.filter(item => typeof item === 'object' && item !== null);

                setHistory(transactions);
            } else {
                // טיפול בשגיאת API (כאשר success: false)
                setError(res.message || "שגיאה בטעינת היסטוריית פעולות.");
            }

            setLoading(false);
        };
        fetchHistory();
    }, [user.phone, user.idNum, user.secret]);

    // --- לוגיקת הצגה ---
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

    // --- טבלת נתונים ---
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
                                {/* ה-Date החוזר הוא סטנדרטי ו-toLocaleString מתרגם אותו יפה */}
                                {new Date(tx.transaction_date).toLocaleString("he-IL")}
                            </TableCell>
                            <TableCell align="center">{tx.description}</TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    // שימוש ב-includes כדי לזהות הפקדה/קבלת תשלום (ירוק) מול הוצאה/משיכה (אדום)
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