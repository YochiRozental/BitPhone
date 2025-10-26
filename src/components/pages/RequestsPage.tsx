import { Box, Typography } from "@mui/material";
import PaymentRequestsList from "../dashboard/PaymentRequestsList";
import type { User } from "../../types";
import Sidebar from "../layout/Sidebar";

export default function RequestsPage({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <Box sx={{ display: "flex", direction: "rtl", minHeight: "100vh" }}>
      <Sidebar onLogout={onLogout} />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" color="primary" sx={{ mb: 3 }}>בקשות תשלום</Typography>
        <PaymentRequestsList user={user} />
      </Box>
    </Box>
  );
}
