import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Card } from "@mui/material";
import * as api from "../api/apiService";
import type { User } from "../types";
import Sidebar from "../components/layout/Sidebar";

const DRAWER_WIDTH = 280;

export default function DashboardPage({ user, onLogout }: { user: User; onLogout: () => void }) {
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadBalance = async () => {
            setIsLoading(true);
            try {
                const res = await api.checkBalance(user);
                setBalance(Number(res.balance) || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadBalance();
    }, [user]);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", direction: "rtl" }}>
            <Sidebar onLogout={onLogout} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
                    boxSizing: "border-box",
                }}
            >
                <Typography variant="h4" color="primary" sx={{ mb: 3 }}>
                    לוח בקרה
                </Typography>

                {isLoading && <CircularProgress />}
                {balance !== null && (
                    <Card
                        sx={{
                            p: 3,
                            textAlign: "center",
                            backgroundColor: "primary.light",
                            color: "white",
                        }}
                    >
                        <Typography variant="h5">היתרה הנוכחית שלך 💰</Typography>
                        <Typography variant="h3">{balance.toLocaleString()} ₪</Typography>
                    </Card>
                )}
            </Box>
        </Box>
    );
}
