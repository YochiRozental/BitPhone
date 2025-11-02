import { Box, Typography } from "@mui/material";
import PaymentRequestsList from "../components/dashboard/PaymentRequests";
import type { User } from "../types/index";

export default function RequestsPage({ user }: { user: User; onLogout: () => void }) {
  return (
    <Box sx={{ display: "flex", direction: "rtl", minHeight: "100vh" }}>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" color="primary" sx={{ mb: 3 }}>בקשות תשלום</Typography>
        <PaymentRequestsList user={user} />
      </Box>
    </Box>
  );
}
