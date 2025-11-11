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
    TableSortLabel,
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

import * as api from "../../api/userApi";
import type { User, Transaction, ApiResponse } from "../../types";

type ActionColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
type DateFilter = "all" | "week" | "month" | "three_months" | "custom";
type SortDirection = 'asc' | 'desc';
type SortColumn = 'transaction_date' | 'amount' | 'action_type' | 'description' | '';

type ActionDetails = { label: string; color: ActionColor; };

export default function TransactionHistory({ user }: { user: User }) {
    const [history, setHistory] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<DateFilter>("all");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
    const [customStartDate, setCustomStartDate] = useState<Dayjs | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Dayjs | null>(null);

    const [sortColumn, setSortColumn] = useState<SortColumn>('transaction_date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const ACTION_RULES: { keywords: string[], details: ActionDetails }[] = [
        {
            keywords: ["deposit"],
            details: { label: "הפקדה", color: "primary" }
        },
        {
            keywords: ["withdraw"],
            details: { label: "משיכה", color: "error" }
        },
        {
            keywords: ["transfer"],
            details: { label: "העברה", color: "success" }
        },
        {
            keywords: ["received"],
            details: { label: "קבלה", color: "warning" }
        },
        {
            keywords: ["payment"],
            details: { label: "תשלום", color: "error" }
        },
    ];

    const DEFAULT_ACTION: ActionDetails = { label: "אחר", color: "info" };

    const getActionType = (action: string): ActionDetails => {
        const normalizedAction = action.toLowerCase();

        const matchingRule = ACTION_RULES.find(rule =>
            rule.keywords.some(keyword => normalizedAction.includes(keyword))
        );

        return matchingRule ? matchingRule.details : DEFAULT_ACTION;
    };

    const handleSort = (column: SortColumn) => {
        setSortDirection(prevDirection =>
            column === sortColumn && prevDirection === 'desc' ? 'asc' : 'desc'
        );
        setSortColumn(column);
    };

    const handleFilterChange = (newFilter: DateFilter) => {
        setFilter(newFilter);
        if (newFilter !== "custom") {
            setCustomStartDate(null);
            setCustomEndDate(null);
        }
    };

    const handleApplyCustomFilter = () => {
        if (customStartDate && customEndDate) {
            handleFilterChange("custom");
            setIsCustomDialogOpen(false);
        } else {
            alert("יש לבחור תאריך התחלה וסיום.");
        }
    };

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

    const sortedAndFilteredHistory = useMemo(() => {
        let dataToSort = history;
        if (filter !== "all") {
            let startDate: Date;
            let endDate: Date = new Date();

            if (filter === "custom" && customStartDate && customEndDate) {
                startDate = customStartDate.startOf('day').toDate();
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
                        startDate = new Date(0);
                        break;
                }
            }
            if (isNaN(startDate.getTime())) return history;

            dataToSort = history.filter(tx => {
                const txDate = new Date(tx.transaction_date);
                const isAfterStart = txDate >= startDate;
                const isBeforeEnd = filter === "custom" ? txDate <= endDate : true;
                return isAfterStart && isBeforeEnd;
            });
        }

        if (!sortColumn) {
            return dataToSort;
        }

        const sortedData = [...dataToSort].sort((a, b) => {
            let aValue: any;
            let bValue: any;
            let comparison = 0;

            switch (sortColumn) {
                case 'transaction_date':
                    aValue = new Date(a.transaction_date).getTime();
                    bValue = new Date(b.transaction_date).getTime();
                    comparison = aValue - bValue;
                    break;
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    comparison = aValue - bValue;
                    break;
                case 'action_type':
                    aValue = getActionType(a.action_type).label;
                    bValue = getActionType(b.action_type).label;
                    comparison = aValue.localeCompare(bValue, 'he', { sensitivity: 'base' });
                    break;
                case 'description':
                    aValue = a.description;
                    bValue = b.description;
                    comparison = aValue.localeCompare(bValue, 'he', { sensitivity: 'base' });
                    break;
                default:
                    return 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return sortedData;

    }, [history, filter, customStartDate, customEndDate, sortColumn, sortDirection]);

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

            <Paper
                sx={{
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                }}
            >
                {sortedAndFilteredHistory.length === 0 && filter !== 'all' ? (
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
                                <SortableTableCell
                                    columnKey="transaction_date"
                                    currentSortColumn={sortColumn}
                                    currentSortDirection={sortDirection}
                                    handleSort={handleSort}
                                    label="תאריך"
                                />
                                <SortableTableCell
                                    columnKey="action_type"
                                    currentSortColumn={sortColumn}
                                    currentSortDirection={sortDirection}
                                    handleSort={handleSort}
                                    label="סוג פעולה"
                                />
                                <SortableTableCell
                                    columnKey="description"
                                    currentSortColumn={sortColumn}
                                    currentSortDirection={sortDirection}
                                    handleSort={handleSort}
                                    label="תיאור"
                                />
                                <SortableTableCell
                                    columnKey="amount"
                                    currentSortColumn={sortColumn}
                                    currentSortDirection={sortDirection}
                                    handleSort={handleSort}
                                    label="סכום"
                                />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedAndFilteredHistory.map((tx, i) => {
                                const { label: chipLabel, color: chipColor } = getActionType(tx.action_type);
                                const isCredit = chipColor === "primary" || chipColor === "warning";

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
                                        '& .MuiInputLabel-root': { right: 'initial', left: 14 }
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

interface SortableTableCellProps {
    columnKey: SortColumn;
    currentSortColumn: SortColumn;
    currentSortDirection: SortDirection;
    handleSort: (column: SortColumn) => void;
    label: string;
}

const SortableTableCell: React.FC<SortableTableCellProps> = ({
    columnKey,
    currentSortColumn,
    currentSortDirection,
    handleSort,
    label,
}) => {
    const isActive = currentSortColumn === columnKey;

    return (
        <TableCell
            align="center"
            onClick={() => handleSort(columnKey)}
            sortDirection={isActive ? currentSortDirection : false}
            sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
            }}
        >
            <TableSortLabel
                active={isActive}
                direction={isActive ? currentSortDirection : 'desc'}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );
};