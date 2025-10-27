import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Stack,
    Card,
    CardContent,
    Typography
} from "@mui/material";
import type { User } from "../../types";
import type { ReactNode } from "react";

interface ActionCardProps {
    title: string;
    children: ReactNode;
}

function ActionCard({ title, children }: ActionCardProps) {
    return (
        <Card sx={{ flex: "1 1 300px", minWidth: "300px", display: "flex", flexDirection: "column", boxShadow: 3 }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" gutterBottom color="primary">{title}</Typography>
                {children}
            </CardContent>
        </Card>
    );
}

interface ActionsSectionProps {
    user: User;
    onApiCall: (apiFunc: () => Promise<any>) => Promise<void>;
    isLoading: boolean;
}

export default function ActionsSection({ user, onApiCall, isLoading }: ActionsSectionProps) {
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [transferDetails, setTransferDetails] = useState({ recipient: "", amount: "" });
    const [paymentRequest, setPaymentRequest] = useState({ phone: "", amount: "" });

    const handleApiCall = (action: 'deposit' | 'withdraw' | 'transfer' | 'request') => {
        let apiFunc: () => Promise<any>;
        let amount: number;

        const apiPromise = import("../../api/apiService").then(api => {
            switch (action) {
                case 'deposit':
                    amount = +depositAmount;
                    return () => api.depositFunds(user, amount);
                case 'withdraw':
                    amount = +withdrawAmount;
                    return () => api.withdrawFunds(user, amount);
                case 'transfer':
                    amount = +transferDetails.amount;
                    return () => api.transferFunds(user, transferDetails.recipient, amount);
                case 'request':
                    amount = +paymentRequest.amount;
                    return () => api.requestPayment(user, paymentRequest.phone, amount);
                default:
                    return () => Promise.reject(new Error("Unknown action"));
            }
        });

        onApiCall(async () => {
            const finalApiFunc = await apiPromise;
            return finalApiFunc();
        });
    };


    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, direction: "rtl" }}>

            <ActionCard title="הפקדה">
                <Stack spacing={2}>
                    <TextField
                        type="number"
                        label="סכום להפקדה"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        inputProps={{ min: "0" }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => handleApiCall('deposit')}
                        disabled={!depositAmount || +depositAmount <= 0 || isLoading}
                    >
                        הפקד
                    </Button>
                </Stack>
            </ActionCard>

            <ActionCard title="משיכה">
                <Stack spacing={2}>
                    <TextField
                        type="number"
                        label="סכום למשיכה"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        inputProps={{ min: "0" }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleApiCall('withdraw')}
                        disabled={!withdrawAmount || +withdrawAmount <= 0 || isLoading}
                    >
                        משוך
                    </Button>
                </Stack>
            </ActionCard>

            <ActionCard title="העברה">
                <Stack spacing={2}>
                    <TextField
                        label="טלפון יעד"
                        value={transferDetails.recipient}
                        onChange={(e) => setTransferDetails({ ...transferDetails, recipient: e.target.value })}
                    />
                    <TextField
                        type="number"
                        label="סכום"
                        value={transferDetails.amount}
                        onChange={(e) => setTransferDetails({ ...transferDetails, amount: e.target.value })}
                        inputProps={{ min: "0" }}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApiCall('transfer')}
                        disabled={!transferDetails.recipient || !transferDetails.amount || +transferDetails.amount <= 0 || isLoading}
                    >
                        העבר
                    </Button>
                </Stack>
            </ActionCard>

            <ActionCard title="בקשת תשלום">
                <Stack spacing={2}>
                    <TextField
                        label="טלפון מבוקש"
                        value={paymentRequest.phone}
                        onChange={(e) => setPaymentRequest({ ...paymentRequest, phone: e.target.value })}
                    />
                    <TextField
                        type="number"
                        label="סכום"
                        value={paymentRequest.amount}
                        onChange={(e) => setPaymentRequest({ ...paymentRequest, amount: e.target.value })}
                        inputProps={{ min: "0" }}
                    />
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleApiCall('request')}
                        disabled={!paymentRequest.phone || !paymentRequest.amount || +paymentRequest.amount <= 0 || isLoading}
                    >
                        בקש תשלום
                    </Button>
                </Stack>
            </ActionCard>
        </Box>
    );
}