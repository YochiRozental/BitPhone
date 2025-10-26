import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Card } from "@mui/material";
import * as api from "../../api/apiService";
import type { User } from "../../types";
import Sidebar from "../layout/Sidebar";

const DRAWER_WIDTH = 280;

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {

    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadBalance = async () => {
            setIsLoading(true);
            const res = await api.checkBalance(user);
            setBalance(Number(res.balance) || 0);
            setIsLoading(false);
        };
        loadBalance();
    }, [user]);

    return (
        <Box sx={{ display: "flex", direction: "rtl", minHeight: "100vh", width: "100%" }}>
            <Sidebar onLogout={onLogout} />
            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mr: { xs: 0, md: `${DRAWER_WIDTH}px` },
                    boxSizing: "border-box",
                }}
            >
                <Typography variant="h4" color="primary" sx={{ mb: 3 }}>לוח בקרה</Typography>

                {isLoading && <CircularProgress />}
                {balance !== null && (
                    <Card sx={{ p: 3, textAlign: "center", backgroundColor: "primary.light", color: "white" }}>
                        <Typography variant="h5">היתרה הנוכחית שלך 💰</Typography>
                        <Typography variant="h3">₪ {balance.toLocaleString()}</Typography>
                    </Card>
                )}
            </Box>
        </Box>
    );
}