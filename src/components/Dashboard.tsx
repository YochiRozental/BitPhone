import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Grid,
    Stack,
    CircularProgress,
    Divider,
} from "@mui/material";
// import Grid from "@mui/material/Unstable_Grid2";
import * as api from "../api/apiService";
import type { User } from "../types";
import TransactionHistory from "./TransactionHistory";

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [deposit, setDeposit] = useState("");
    const [withdraw, setWithdraw] = useState("");
    const [transfer, setTransfer] = useState({ recipient: "", amount: "" });

    const handleApi = async (fn: () => Promise<any>) => {
        setIsLoading(true);
        const res = await fn();
        setMessage(res.message || JSON.stringify(res));
        setIsLoading(false);
    };

    return (
        <Box sx={{ p: 3, direction: "rtl" }}>
            {/* כותרת עליונה */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    ברוך הבא, {user.name || `משתמש ${user.phone}`}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? "הסתר היסטוריה" : "הצג היסטוריה"}
                    </Button>
                    <Button variant="contained" color="error" onClick={onLogout}>
                        התנתק
                    </Button>
                </Stack>
            </Box>

            {message && (
                <Card sx={{ mb: 3, bgcolor: "#e3f2fd" }}>
                    <CardContent>
                        <Typography variant="body1">{message}</Typography>
                    </CardContent>
                </Card>
            )}

            {isLoading && (
                <Box display="flex" justifyContent="center" my={2}>
                    <CircularProgress />
                </Box>
            )}

            {showHistory && (
                <Box my={3}>
                    <TransactionHistory user={user} />
                </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* אזור פעולות */}
            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                בדיקת יתרה
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => handleApi(() => api.checkBalance(user))}
                            >
                                בדוק יתרה
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                הפקדה
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                label="סכום"
                                value={deposit}
                                onChange={(e) => setDeposit(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleApi(() => api.depositFunds(user, +deposit))}
                            >
                                הפקד
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                משיכה
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                label="סכום"
                                value={withdraw}
                                onChange={(e) => setWithdraw(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={() => handleApi(() => api.withdrawFunds(user, +withdraw))}
                            >
                                משוך
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid xs={12} md={6} lg={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                העברה
                            </Typography>
                            <TextField
                                fullWidth
                                label="טלפון יעד"
                                value={transfer.recipient}
                                onChange={(e) =>
                                    setTransfer({ ...transfer, recipient: e.target.value })
                                }
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="סכום"
                                type="number"
                                value={transfer.amount}
                                onChange={(e) =>
                                    setTransfer({ ...transfer, amount: e.target.value })
                                }
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                onClick={() =>
                                    handleApi(() =>
                                        api.transferFunds(user, transfer.recipient, +transfer.amount)
                                    )
                                }
                            >
                                העבר
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
