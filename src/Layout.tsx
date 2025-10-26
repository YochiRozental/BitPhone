import type { ReactNode } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    useTheme,
    CssBaseline,
} from "@mui/material";
import Sidebar from "./components/layout/Sidebar";

const DRAWER_WIDTH = 280;

interface LayoutProps {
    children: ReactNode;
    authButton?: ReactNode;
    title: string;
    greeting?: string;
    onLogout?: () => void;
}

export default function Layout({
    children,
    authButton,
    title,
    greeting,
    onLogout,
}: LayoutProps) {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", direction: "rtl", minHeight: "100vh", margin: 100 }}>
            <CssBaseline />

            <Sidebar onLogout={onLogout!} />

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    marginRight: { xs: 0, md: `${DRAWER_WIDTH}px` },
                    backgroundColor: theme.palette.background.default,
                    minHeight: "100vh",
                }}
            >
                <AppBar position="fixed" color="primary" elevation={3}
                    sx={{ right: { md: `${DRAWER_WIDTH}px` }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}
                >
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {authButton && <Box sx={{ mr: 1 }}>{authButton}</Box>}
                            {greeting && <Typography variant="body1">{greeting}</Typography>}
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                            {title}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Toolbar />

                <Box component="main" sx={{ flexGrow: 1, py: 4, px: 3 }}>
                    {children}
                </Box>

                <Box
                    component="footer"
                    sx={{
                        py: 2,
                        mt: "auto",
                        backgroundColor: theme.palette.background.paper,
                        textAlign: "center",
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                >
                </Box>
            </Box>
        </Box>
    );
}
