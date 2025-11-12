import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from "@mui/material";
import FilterBar from "../filters/FilterBar";
import SortableTableCell from "../filters/SortableTableCell";
import { useTransactionFilter } from "../filters/useTransactionFilter";
import type { User, Transaction } from "../../types";
import { formatDateTime } from "../filters/utils/dateUtils";

export default function TransactionHistory({ user }: { user: User }) {

  const theme = useTheme();

  const {
    sortedAndFiltered,
    history,
    loading,
    error,
    filter,
    setFilter,
    customStartDate,
    customEndDate,
    setCustomStartDate,
    setCustomEndDate,
    sortColumn,
    sortDirection,
    handleSort,
    getActionType,
  } = useTransactionFilter(user);

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
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomDateChange={(start, end) => {
          setCustomStartDate(start);
          setCustomEndDate(end);
        }}
      />

      <Paper sx={{ overflow: "hidden", borderRadius: 2, boxShadow: theme.shadows[3] }}>
        {sortedAndFiltered.length === 0 && filter !== "all" ? (
          <Box p={3} textAlign="center">
            <Typography color="text.secondary">
              אין תנועות תואמות לטווח הזמן שנבחר.
            </Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: theme.palette.grey[100],
                  "& th": { color: theme.palette.primary.dark, fontWeight: "bold" },
                }}
              >
                {[
                  { key: "transaction_date" as keyof Transaction, label: "תאריך" },
                  { key: "action_type" as keyof Transaction, label: "סוג פעולה" },
                  { key: "description" as keyof Transaction, label: "תיאור" },
                  { key: "amount" as keyof Transaction, label: "סכום" },
                ].map(({ key, label }) => (
                  <SortableTableCell
                    key={key}
                    columnKey={key}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    handleSort={handleSort}
                    label={label}
                  />
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedAndFiltered.map((tx, i) => {
                const { label, color } = getActionType(tx.action_type);
                const isCredit = color === "primary" || color === "warning";
                const amount = `${isCredit ? "+" : "-"} ${tx.amount}`;
                const amountColor = isCredit
                  ? theme.palette.success.dark
                  : theme.palette.error.dark;

                return (
                  <TableRow
                    key={i}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
                      "&:hover": { backgroundColor: theme.palette.action.selected, cursor: "pointer" },
                    }}
                  >
                    <TableCell align="center">{formatDateTime(tx.transaction_date)}</TableCell>
                    <TableCell align="center">
                      <Chip label={label} color={color as any} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {tx.description}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: amountColor, fontWeight: "bold", direction: "ltr" }}
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
    </Box>
  );
}
