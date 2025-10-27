import { useEffect, useState, useMemo } from "react";
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
    useTheme,
    Button,
    Stack,
    ButtonBase,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs"; // יש לוודא ש-dayjs מותקן

import * as api from "../../api/apiService";
import type { User, Transaction, ApiResponse } from "../../types";

// הגדרת טיפוס למסנן המעודכן
type DateFilter = "all" | "week" | "month" | "three_months" | "custom";

// הגדרת קומפוננטת TransactionHistory
export default function TransactionHistory({ user }: { user: User }) {
    const [history, setHistory] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<DateFilter>("all");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    // מצבי סטייט חדשים לבחירת תאריכים מותאמת אישית
    const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
    const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Dayjs | null>(null);

    // פונקציה לשינוי המסנן
    const handleFilterChange = (newFilter: DateFilter) => {
        setFilter(newFilter);
        if (newFilter !== "custom") {
            setCustomStartDate(null);
            setCustomEndDate(null);
        }
    };

    // פונקציה להחלת טווח תאריכים מותאם אישית
    const handleApplyCustomFilter = () => {
        if (customStartDate && customEndDate) {
            handleFilterChange("custom");
            setIsCustomDialogOpen(false);
        } else {
            alert("יש לבחור תאריך התחלה וסיום.");
        }
    };

    // ... useEffect נשאר זהה ...
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError("");
            setHistory([]);

            try {
                const res: ApiResponse = await api.getTransactionHistory(user);
                const fullResponse = res as any;

                if (res.success) {
                    let transactions: Transaction[] = [];

                    if (Array.isArray(fullResponse.history)) {
                        transactions = fullResponse.history as Transaction[];
                    } else {
                        setError("המערכת לא זיהתה את מבנה נתוני ההיסטוריה.");
                    }

                    transactions = transactions
                        .filter(item => typeof item === 'object' && item !== null)
                        .sort((a, b) =>
                            new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
                        );

                    setHistory(transactions);
                } else {
                    setError(res.message || "שגיאה בטעינת היסטוריית פעולות.");
                }
            } catch (err) {
                console.error("שגיאה בטעינת היסטוריית פעולות:", err);
                setError("שגיאה בטעינת היסטוריית פעולות.");
            }

            setLoading(false);
        };
        fetchHistory();
    }, [user.phone, user.idNum, user.secret]);
    // ... סוף useEffect ...


    // לוגיקת הסינון בפועל באמצעות useMemo - מעודכן עם "custom"
    const filteredHistory = useMemo(() => {
        if (filter === "all") {
            return history;
        }

        let startDate: Date;
        let endDate: Date = new Date(); // כברירת מחדל עד היום

        if (filter === "custom" && customStartDate && customEndDate) {
            // עבור סינון מותאם אישית, נוודא שהשעה היא 00:00:00 ו-23:59:59
            startDate = customStartDate.startOf('day').toDate();
            // End date should be end of day to include transactions from that day
            endDate = customEndDate.endOf('day').toDate();
        } else {
            const now = new Date();
            switch (filter) {
                case "week":
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                    break;
                case "month":
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break;
                case "three_months":
                    startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    break;
                default:
                    return history;
            }
        }

        // נדאג שהתאריכים יהיו תאריכים חוקיים
        if (isNaN(startDate.getTime())) return history;
        if (filter === "custom" && isNaN(endDate.getTime())) return history;

        return history.filter(tx => {
            const txDate = new Date(tx.transaction_date);

            // תנאי הסינון
            const isAfterStart = txDate >= startDate;
            const isBeforeEnd = filter === "custom" ? txDate <= endDate : true; // אם לא custom, אין הגבלת סוף טווח

            return isAfterStart && isBeforeEnd;
        });

    }, [history, filter, customStartDate, customEndDate]);

    // פונקציות עזר קיימות
    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCustomDateRange = () => {
        if (filter === "custom" && customStartDate && customEndDate) {
            const start = customStartDate.format('DD/MM/YYYY');
            const end = customEndDate.format('DD/MM/YYYY');
            return `${start} - ${end}`;
        }
        return "בחר תאריכים";
    };

    const getActionType = (action: string) => {
        if (action.includes("deposit") || action.includes("received")) {
            return { label: "הפקדה/קבלה", color: "success" };
        }
        if (action.includes("transfer") || action.includes("payment")) {
            return { label: "העברה/תשלום", color: "error" };
        }
        if (action.includes("withdraw")) {
            return { label: "משיכה", color: "error" };
        }
        return { label: "אחר", color: "info" };
    };

    // מצבי טעינה ושגיאה נשארים זהים...
    if (loading)
        return (
            <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress color="primary" />
            </Box>
        );

    if (error)
        return (
            <Typography color="error" textAlign="center" variant="h6" p={3}>
                {error}
            </Typography>
        );

    // אם אין נתונים לאחר טעינה ראשונית
    if (!history.length)
        return (
            <Box p={3} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
                <Typography textAlign="center" color="text.secondary">
                    אין תנועות להצגה
                </Typography>
            </Box>
        );

    return (
        <Box sx={{ direction: "rtl" }}>

            {/* רכיבי הסינון - מעודכן עם כפתור מותאם אישית */}
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
                    { key: "all", label: "כל הזמנים" },
                    { key: "week", label: "שבוע אחרון" },
                    { key: "month", label: "חודש אחרון" },
                    { key: "three_months", label: "3 חודשים אחרונים" },
                ].map(({ key, label }) => {
                    const isActive = filter === key;
                    const borderColor = isActive ? theme.palette.primary.main : theme.palette.divider;

                    return (
                        <ButtonBase
                            key={key}
                            onClick={() => handleFilterChange(key as DateFilter)}
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            sx={{
                                borderRadius: "9999px",
                                overflow: "hidden",
                                transition: "0.3s",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderRadius: "9999px",
                                    border: `1.5px solid ${borderColor}`,
                                    color: isActive ? "white" : theme.palette.primary.main,
                                    backgroundColor: isActive ? theme.palette.primary.main : 'white',
                                    fontWeight: isActive ? "bold" : "normal",
                                    transition: "0.3s",
                                }}
                            >
                                {label}
                            </Box>
                        </ButtonBase>
                    );
                })}

                {/* כפתור סינון מותאם אישית */}
                <ButtonBase
                    onClick={() => setIsCustomDialogOpen(true)}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    sx={{
                        borderRadius: "9999px",
                        overflow: "hidden",
                        transition: "0.3s",
                    }}
                >
                    <Box
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: "9999px",
                            border: `1.5px solid ${filter === "custom" ? theme.palette.secondary.main : theme.palette.divider}`,
                            color: filter === "custom" ? "white" : theme.palette.secondary.main,
                            backgroundColor: filter === "custom" ? theme.palette.secondary.main : 'white',
                            fontWeight: filter === "custom" ? "bold" : "normal",
                            transition: "0.3s",
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <CalendarMonthIcon sx={{ fontSize: 18 }} />
                        {formatCustomDateRange()}
                    </Box>
                </ButtonBase>
            </Box>

            {/* הטבלה עצמה */}
            <Paper
                sx={{
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                }}
            >
                {filteredHistory.length === 0 && filter !== 'all' ? (
                    <Box p={3} textAlign="center">
                        <Typography color="text.secondary">
                            אין תנועות תואמות בטווח הזמן שנבחר.
                        </Typography>
                    </Box>
                ) : (
                    <Table stickyHeader aria-label="history table">
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: theme.palette.grey[100],
                                    '& th': { color: theme.palette.primary.dark, fontWeight: 'bold' }
                                }}
                            >
                                <TableCell align="center">תאריך</TableCell>
                                <TableCell align="center">סוג פעולה</TableCell>
                                <TableCell align="center">תיאור</TableCell>
                                <TableCell align="center">סכום</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredHistory.map((tx, i) => {
                                const { label: chipLabel, color: chipColor } = getActionType(tx.action_type);
                                const isCredit = chipColor === "success";
                                const amount = isCredit ? `+ ${tx.amount}` : `- ${tx.amount}`;
                                const color = isCredit ? theme.palette.success.dark : theme.palette.error.dark;

                                return (
                                    <TableRow
                                        key={i}
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
                                            '&:hover': { backgroundColor: theme.palette.action.selected, cursor: 'pointer' }
                                        }}
                                    >
                                        <TableCell align="center">
                                            {formatDateTime(tx.transaction_date)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={chipLabel}
                                                color={chipColor as "success" | "error" | "info"}
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: "4px" }}
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {tx.description}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ color, fontWeight: "bold", direction: "ltr" }}
                                        >
                                            {amount} ₪
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            <Dialog
                open={isCustomDialogOpen}
                onClose={() => setIsCustomDialogOpen(false)}
                aria-labelledby="custom-date-range-dialog"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ textAlign: 'right', direction: 'rtl' }}>בחר טווח תאריכים</DialogTitle>
                <DialogContent sx={{ direction: 'rtl' }}>
                    <Stack spacing={3} direction="column" sx={{ mt: 1 }}>
                        <DatePicker
                            label="תאריך התחלה"
                            value={customStartDate}
                            onChange={(newValue) => setCustomStartDate(newValue)}
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    InputLabelProps: { shrink: true },
                                    sx: {
                                        '.MuiInputBase-root': { direction: 'ltr' },
                                        '& .MuiInputLabel-root': { right: 'initial', left: 14 }
                                    }
                                }
                            }}
                        />

                        <DatePicker
                            label="תאריך סיום"
                            value={customEndDate}
                            onChange={(newValue) => setCustomEndDate(newValue)}
                            minDate={customStartDate ? customStartDate : undefined}
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    InputLabelProps: { shrink: true },
                                    sx: {
                                        '.MuiInputBase-root': { direction: 'ltr' },
                                        '& .MuiInputLabel-root': { right: 'initial', left: 14 } // תיקון מיקום הלייבל
                                    }
                                }
                            }}
                        />

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between', direction: 'rtl', p: 3 }}>
                    <Button onClick={() => setIsCustomDialogOpen(false)} color="error" variant="outlined">
                        ביטול
                    </Button>
                    <Button
                        onClick={handleApplyCustomFilter}
                        color="primary"
                        variant="contained"
                        disabled={!customStartDate || !customEndDate}
                    >
                        החל סינון
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}