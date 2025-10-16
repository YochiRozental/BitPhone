import type { ReactNode } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    useTheme,
    CssBaseline,
} from "@mui/material";

interface LayoutProps {
    children: ReactNode;
    authButton?: ReactNode;
    title: string;
    greeting?: string;
}

export default function Layout({
    children,
    authButton,
    title,
    greeting
}: LayoutProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                direction: "rtl",
            }}
        >
            <CssBaseline />

            <AppBar position="static" color="primary">
                <Toolbar sx={{ justifyContent: "space-between" }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ mr: 1 }}>
                            {authButton}
                        </Box>

                        {greeting && (
                            <Typography variant="body1" color="inherit">
                                {greeting}
                            </Typography>
                        )}
                    </Box>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ textAlign: 'left' }}
                    >
                        {title}
                    </Typography>

                </Toolbar>
            </AppBar>

            <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, my: 4 }}>
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: "auto",
                    backgroundColor: theme.palette.grey[200],
                    textAlign: "center",
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}