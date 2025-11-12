import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Box,
    Typography,
    useTheme,
} from "@mui/material";
import React from "react";

interface Column<T> {
    key: keyof T;
    label: string;
    align?: "left" | "center" | "right";
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, any>> {
    columns: Column<T>[];
    rows: T[];
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    rows,
    emptyMessage = "אין נתונים להצגה",
    onRowClick,
}: DataTableProps<T>) {
    const theme = useTheme();

    if (!rows.length) {
        return (
            <Box p={3} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
                <Typography textAlign="center" color="text.secondary">
                    {emptyMessage}
                </Typography>
            </Box>
        );
    }

    return (
        <Paper sx={{ overflow: "hidden", borderRadius: 2, boxShadow: theme.shadows[3] }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: theme.palette.grey[100],
                            "& th": { color: theme.palette.primary.dark, fontWeight: "bold" },
                        }}
                    >
                        {columns.map((col) => (
                            <TableCell key={String(col.key)} align={col.align || "center"}>
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow
                            key={i}
                            sx={{
                                height: 56,
                                "& td, & th": {
                                    height: 56,
                                    py: 1,
                                },
                                "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
                                "&:hover": {
                                    backgroundColor: theme.palette.action.selected,
                                    cursor: onRowClick ? "pointer" : "default",
                                },
                            }}
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((col) => {
                                const value = row[col.key];
                                const content =
                                    col.render?.(value, row) ??
                                    (typeof value === "object" ? JSON.stringify(value) : String(value));

                                return (
                                    <TableCell key={String(col.key)} align={col.align || "center"}>
                                        {content as React.ReactNode}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>


            </Table>
        </Paper>
    );
}
