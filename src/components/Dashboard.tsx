import { useState, type ReactNode } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Stack,
    CircularProgress,
    Divider,
} from "@mui/material";
import * as api from "../api/apiService";
import type { User } from "../types";
import TransactionHistory from "./TransactionHistory";
import PaymentRequestsList from "./PaymentRequestsList";

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

interface ActionCardProps {
    title: string;
    children: ReactNode;
}

function ActionCard({ title, children }: ActionCardProps) {
    return (
        <Card
            sx={{
                flex: "1 1 300px",
                minWidth: "300px",
                display: "flex",
                flexDirection: "column",
                boxShadow: 3,
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" gutterBottom color="primary">
                    {title}
                </Typography>
                {children}
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ user }: DashboardProps) {
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [transferDetails, setTransferDetails] = useState({ recipient: "", amount: "" });
    const [paymentRequest, setPaymentRequest] = useState({ phone: "", amount: "" });
    const [showRequests, setShowRequests] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);


    const handleApiCall = async (apiFunc: () => Promise<any>) => {
        setMessage(null);
        setIsLoading(true);
        try {
            const res = await apiFunc();
            setMessage({ text: res.message || JSON.stringify(res), type: "success" });
            if (showBalance) {
                await api.checkBalance(user).then(res => setBalance(Number(res.balance) || 0));
            }
            return true;
        } catch (error: any) {
            setMessage({ text: error.message || "An unexpected error occurred.", type: "error" });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckBalance = async () => {
        const newShowBalance = !showBalance;
        setShowBalance(newShowBalance);

        if (newShowBalance) {
            setBalance(null);
            const success = await handleApiCall(async () => {
                const res = await api.checkBalance(user);
                console.log("Balance response:", res);
                setBalance(Number(res.balance) || 0);
                return res;
            });

            if (!success) setBalance(null);
        }
    };


    const handleDeposit = async () => {
        const success = await handleApiCall(() => api.depositFunds(user, +depositAmount));
        if (success) setDepositAmount("");
    };

    const handleWithdraw = async () => {
        const success = await handleApiCall(() => api.withdrawFunds(user, +withdrawAmount));
        if (success) setWithdrawAmount("");
    };

    const handleTransfer = async () => {
        const success = await handleApiCall(() =>
            api.transferFunds(user, transferDetails.recipient, +transferDetails.amount)
        );
        if (success) setTransferDetails({ recipient: "", amount: "" });
    };

    const handlePaymentRequest = async () => {
        const success = await handleApiCall(() =>
            api.requestPayment(user, paymentRequest.phone, +paymentRequest.amount)
        );
        if (success) setPaymentRequest({ phone: "", amount: "" });
    };


    return (
        <Box sx={{ p: 3, direction: "rtl", maxWidth: "1200px", margin: "0 auto" }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Typography variant="h4" component="h1" color="primary">
                    לוח בקרה
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        onClick={() => setShowHistory(!showHistory)}
                        disabled={isLoading && !showHistory}
                    >
                        {showHistory ? "הסתר היסטוריה" : "הצג היסטוריה"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setShowRequests(!showRequests)}
                        disabled={isLoading && !showRequests}
                    >
                        {showRequests ? "הסתר בקשות תשלום" : "הצג בקשות תשלום"}
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCheckBalance}
                        disabled={isLoading}
                    >
                        {showBalance ? "הסתר יתרה" : "הצג יתרה"}
                    </Button>

                </Stack>
            </Stack>

            <Stack spacing={3} my={3}>

                {isLoading && (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                )}

                {showBalance && balance !== null && (
                    <Card sx={{
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "primary.light",
                        color: "primary.contrastText",
                        boxShadow: 5
                    }}>
                        <Typography variant="h5" component="div">
                            היתרה הנוכחית שלך 💰
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                            {balance.toLocaleString()} ₪
                        </Typography>
                    </Card>
                )}

                {showHistory && <TransactionHistory user={user} />}
                {showRequests && <PaymentRequestsList user={user} />}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <ActionCard title="הפקדה">
                    <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="סכום להפקדה"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleDeposit}
                            disabled={isLoading || !depositAmount || +depositAmount <= 0}
                        >
                            הפקד
                        </Button>
                    </Stack>
                </ActionCard>

                <ActionCard title="משיכה">
                    <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="סכום למשיכה"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handleWithdraw}
                            disabled={isLoading || !withdrawAmount || +withdrawAmount <= 0}
                        >
                            משוך
                        </Button>
                    </Stack>
                </ActionCard>

                <ActionCard title="העברה">
                    <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
                        <TextField
                            fullWidth
                            label="טלפון יעד"
                            value={transferDetails.recipient}
                            onChange={(e) =>
                                setTransferDetails({ ...transferDetails, recipient: e.target.value })
                            }
                        />
                        <TextField
                            fullWidth
                            label="סכום"
                            type="number"
                            value={transferDetails.amount}
                            onChange={(e) =>
                                setTransferDetails({ ...transferDetails, amount: e.target.value })
                            }
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={handleTransfer}
                            disabled={
                                isLoading ||
                                !transferDetails.recipient ||
                                !transferDetails.amount ||
                                +transferDetails.amount <= 0
                            }
                        >
                            העבר
                        </Button>
                    </Stack>
                </ActionCard>

                <ActionCard title="בקשת תשלום">
                    <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
                        <TextField
                            fullWidth
                            label="טלפון מבוקש"
                            value={paymentRequest.phone}
                            onChange={(e) =>
                                setPaymentRequest({ ...paymentRequest, phone: e.target.value })
                            }
                        />
                        <TextField
                            fullWidth
                            label="סכום"
                            type="number"
                            value={paymentRequest.amount}
                            onChange={(e) =>
                                setPaymentRequest({ ...paymentRequest, amount: e.target.value })
                            }
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="warning"
                            onClick={handlePaymentRequest}
                            disabled={
                                isLoading ||
                                !paymentRequest.phone ||
                                !paymentRequest.amount ||
                                +paymentRequest.amount <= 0
                            }
                        >
                            בקש תשלום
                        </Button>
                    </Stack>
                </ActionCard>

            </Box>
        </Box>
    );
}