import { Box, Typography } from "@mui/material";
import Sidebar from "../components/layout/Sidebar";
import SentPaymentRequests from "../components/dashboard/SentPaymentRequests";
import type { User } from "../types";

interface SentRequestsPageProps {
    user: User;
    onLogout: () => void;
}

export default function SentRequestsPage({ user, onLogout }: SentRequestsPageProps) {

    return (

        <Box sx={{ display: "flex", minHeight: "100vh", direction: "rtl" }}>
            <Sidebar onLogout={onLogout} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    boxSizing: "border-box",
                }}
            >
                <Typography variant="h4" color="primary" sx={{ mb: 4 }}>
                    בקשות תשלום ששלחתי
                </Typography>

                <SentPaymentRequests user={user} />

            </Box>
        </Box>
    );
}