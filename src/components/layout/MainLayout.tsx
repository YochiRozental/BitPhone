import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export default function MainLayout({
    children,
    onLogout,
}: {
    children: React.ReactNode;
    onLogout: () => void;
}) {
    return (
        <Box sx={{ display: "flex", direction: "rtl", minHeight: "100vh" }}>
            <Sidebar onLogout={onLogout} />
            <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
        </Box>
    );
}
