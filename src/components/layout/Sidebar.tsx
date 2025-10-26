import {
    Drawer, List, ListItemButton, ListItemText, ListItemIcon, Box,
    Typography, Divider, IconButton, useTheme, useMediaQuery
} from "@mui/material";
import { Menu, AccountBalanceWallet, History, Payment, Logout } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 280;

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { key: "balance", label: "יתרה נוכחית", icon: <AccountBalanceWallet />, path: "/" },
        { key: "history", label: "היסטוריית פעולות", icon: <History />, path: "/history" },
        { key: "requests", label: "בקשות תשלום", icon: <Payment />, path: "/requests" },
    ];

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box textAlign="center" pt={4} pb={2}>
                <Typography variant="h5" color={theme.palette.primary.main} fontWeight={700}>
                    הארנק הדיגיטלי
                </Typography>
                <Typography variant="caption" color="text.secondary">ניהול חשבון</Typography>
                <Divider sx={{ mt: 2, mx: 3 }} />
            </Box>

            <List sx={{ direction: "rtl", flexGrow: 1, px: 2, py: 1 }}>
                {menuItems.map(item => (
                    <ListItemButton
                        key={item.key}
                        onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                        sx={{ mb: 1, borderRadius: 2 }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ p: 2 }}>
                <ListItemButton onClick={onLogout} sx={{ borderRadius: 2, bgcolor: "#fff1f1", color: theme.palette.error.main }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><Logout /></ListItemIcon>
                    <ListItemText primary="התנתקות" />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ position: 'fixed', top: 16, right: 16, zIndex: theme.zIndex.drawer + 1 }}
                >
                    <Menu />
                </IconButton>
            )}

            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                anchor="left"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: DRAWER_WIDTH,
                        boxSizing: "border-box",
                        background: theme.palette.mode === 'light' ? "#f9f9f9" : theme.palette.background.default,
                        boxShadow: theme.shadows[8],
                        borderRight: `1px solid ${theme.palette.divider}`,
                    },
                }}
            >

                {drawerContent}
            </Drawer>
        </>
    );
}