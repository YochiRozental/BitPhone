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
    Alert,
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
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" gutterBottom>
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
    const [requestDetails, setRequestDetails] = useState({ recipient: "", amount: "" });
    const [showRequests, setShowRequests] = useState(false);
    const [showBalance, setShowBalance] = useState(false);

    const handleApiCall = async (apiFunc: () => Promise<any>) => {
        setMessage(null);
        setIsLoading(true);
        try {
            const res = await apiFunc();
            setMessage({ text: res.message || JSON.stringify(res), type: "success" });
            return true;
        } catch (error: any) {
            setMessage({ text: error.message || "An unexpected error occurred.", type: "error" });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckBalance = () => {
        setShowBalance(!showBalance);
        console.log(showBalance);
        if (showBalance) {
            handleApiCall(() => api.checkBalance(user));
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

    const handleRequestPayment = async () => {
        const success = await handleApiCall(() =>
            api.requestPayment(user, requestDetails.recipient, +requestDetails.amount)
        );
        if (success) setRequestDetails({ recipient: "", amount: "" });
    };


    return (
        <Box sx={{ p: 3, direction: "rtl" }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? "הסתר היסטוריה" : "הצג היסטוריה"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setShowRequests(!showRequests)}
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
                {message && <Alert severity={message.type}>{message.text}</Alert>}
                {isLoading && (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                )}
                {showHistory && <TransactionHistory user={user} />}
                {showRequests && <PaymentRequestsList user={user} />}
                {showBalance}

            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <ActionCard title="הפקדה">
                    <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="סכום"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleDeposit}
                            disabled={isLoading || !depositAmount}
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
                            label="סכום"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handleWithdraw}
                            disabled={isLoading || !withdrawAmount}
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
                                !transferDetails.amount
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
                                isLoading || !paymentRequest.phone || !paymentRequest.amount
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
