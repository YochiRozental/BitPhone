import React from "react";
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

type Align = "left" | "center" | "right";

interface DataColumn<T> {
    key: keyof T;
    label: string;
    align?: Align;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface VirtualColumn<T> {
    key?: string;
    label: string;
    align?: Align;
    render: (value: undefined, row: T) => React.ReactNode;
}

export type Column<T> = DataColumn<T> | VirtualColumn<T>;

export interface DataTableProps<T extends Record<string, any>> {
    columns: Column<T>[];
    rows: T[];
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
}

function isDataColumn<T>(col: Column<T>): col is DataColumn<T> {
    return typeof col.key !== "undefined" && !!(col as DataColumn<T>).key;
}

export default function DataTable<T extends Record<string, any>>({
    columns,
    rows,
    emptyMessage = "אין נתונים להצגה",
    onRowClick,
}: DataTableProps<T>) {
    const theme = useTheme();
    const Wrapper = Paper as React.ElementType;

    const headerBackgroundColor = theme.palette.primary.light;

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
        <Wrapper
            sx={{
                overflow: "hidden",
                direction: "rtl",
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                border: `1px solid ${theme.palette.grey[200]}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: headerBackgroundColor,
                            "& th": {
                                color: theme.palette.primary.dark,
                                fontWeight: "bold",
                                fontSize: '0.875rem',
                                border: 'none',
                            },
                        }}
                    >
                        {columns.map((col, i) => (
                            <TableCell key={col.key ? String(col.key) : `col-${i}`} align={col.align || "center"}>
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
                                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                                    border: 'none',
                                },
                                "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
                                "&:hover": {
                                    backgroundColor: theme.palette.action.selected,
                                    cursor: onRowClick ? "pointer" : "default",
                                },
                            }}
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((col, j) => {
                                if (isDataColumn(col)) {
                                    const value = row[col.key];
                                    const content =
                                        col.render?.(value, row) ??
                                        (typeof value === "object" ? JSON.stringify(value) : String(value ?? ""));
                                    return (
                                        <TableCell key={String(col.key)} align={col.align || "center"}>
                                            {content}
                                        </TableCell>
                                    );
                                } else {
                                    const content = col.render(undefined, row);
                                    return (
                                        <TableCell key={`virtual-${j}`} align={col.align || "center"}>
                                            {content}
                                        </TableCell>
                                    );
                                }
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Wrapper>
    );
}