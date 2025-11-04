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
    Chip,
    useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import type { User, ApiResponse } from "../../types";
import * as api from "../../api/adminApi";

export default function AdminUsersPage({ user }: { user: User }) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const theme = useTheme();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res: ApiResponse = await api.getAllUsers(user);

                if (res.success && Array.isArray((res as any).users)) {
                    if (res.success && Array.isArray((res as any).users)) {
                        const normalized = (res as any).users.map((u: any) => ({
                            phone: u.phone_number,
                            idNum: u.id_number,
                            balance: u.balance,
                            role: u.role,
                            name: u.name,
                        }));
                        setUsers(normalized);
                    }
                } else {
                    setError(res.message || "שגיאה בטעינת המשתמשים.");
                }
            } catch (err) {
                console.error("שגיאה בטעינת המשתמשים:", err);
                setError("שגיאה בטעינת המשתמשים.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user.phone, user.secret]);

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

    if (!users.length)
        return (
            <Box p={3} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
                <Typography textAlign="center" color="text.secondary">
                    אין משתמשים להצגה
                </Typography>
            </Box>
        );

    return (
        <Box sx={{ direction: "rtl" }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                mb={3}
                component={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                רשימת כל המשתמשים
            </Typography>

            <Paper
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: theme.palette.grey[100],
                                '& th': { color: theme.palette.primary.dark, fontWeight: 'bold' },
                            }}
                        >
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">שם</TableCell>
                            <TableCell align="center">טלפון</TableCell>
                            <TableCell align="center">תעודת זהות</TableCell>
                            <TableCell align="center">יתרה</TableCell>
                            <TableCell align="center">תפקיד</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u, i) => (
                            <TableRow
                                key={i}
                                sx={{
                                    '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
                                    '&:hover': { backgroundColor: theme.palette.action.selected, cursor: 'pointer' },
                                }}
                            >
                                <TableCell align="center">{i + 1}</TableCell>
                                <TableCell align="center">{u.name}</TableCell>
                                <TableCell align="center">{u.phone}</TableCell>
                                <TableCell align="center">{u.idNum}</TableCell>
                                <TableCell align="center">{u.balance} ₪</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={u.role === "admin" ? "מנהל" : "משתמש"}
                                        color={u.role === "admin" ? "primary" : "default"}
                                        variant="outlined"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
