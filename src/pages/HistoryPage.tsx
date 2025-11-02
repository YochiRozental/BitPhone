import { Box, Typography } from "@mui/material";
import TransactionHistory from "../components/dashboard/TransactionHistory";
import type { User } from "../types/index";

export default function HistoryPage({ user }: { user: User; onLogout: () => void }) {
  return (
    <Box sx={{ display: "flex", direction: "rtl", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" color="primary" sx={{ mb: 3 }}>היסטוריית פעולות</Typography>
        <TransactionHistory user={user} />
      </Box>
    </Box>
  );
}
