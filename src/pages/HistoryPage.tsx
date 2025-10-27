import { Box, Typography } from "@mui/material";
import TransactionHistory from "../components/dashboard/TransactionHistory";
import type { User } from "../types/index";
import Sidebar from "../components/layout/Sidebar";

export default function HistoryPage({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <Box sx={{ display: "flex", direction: "rtl", minHeight: "100vh" }}>
      <Sidebar onLogout={onLogout} />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" color="primary" sx={{ mb: 3 }}>היסטוריית פעולות</Typography>
        <TransactionHistory user={user} />
      </Box>
    </Box>
  );
}
