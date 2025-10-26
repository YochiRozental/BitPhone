import { useState } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";
import ActionCard from "./ActionCard.tsx";
import type { User } from "../../types";

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

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, direction: "rtl" }}>
            <ActionCard title="הפקדה">
                <Stack spacing={2}>
                    <TextField type="number" label="סכום להפקדה" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                    <Button variant="contained" onClick={() => onApiCall(() => import("../../api/apiService").then(api => api.depositFunds(user, +depositAmount)))} disabled={!depositAmount || +depositAmount <= 0 || isLoading}>
                        הפקד
                    </Button>
                </Stack>
            </ActionCard>

            <ActionCard title="משיכה">
                <Stack spacing={2}>
                    <TextField type="number" label="סכום למשיכה" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                    <Button variant="contained" color="secondary" onClick={() => onApiCall(() => import("../../api/apiService").then(api => api.withdrawFunds(user, +withdrawAmount)))} disabled={!withdrawAmount || +withdrawAmount <= 0 || isLoading}>
                        משוך
                    </Button>
                </Stack>
            </ActionCard>

            <ActionCard title="העברה">
                <Stack spacing={2}>
                    <TextField label="טלפון יעד" value={transferDetails.recipient} onChange={(e) => setTransferDetails({ ...transferDetails, recipient: e.target.value })} />
                    <TextField type="number" label="סכום" value={transferDetails.amount} onChange={(e) => setTransferDetails({ ...transferDetails, amount: e.target.value })} />
                    <Button variant="contained" color="success" onClick={() => onApiCall(() => import("../../api/apiService").then(api => api.transferFunds(user, transferDetails.recipient, +transferDetails.amount)))} disabled={!transferDetails.recipient || !transferDetails.amount || +transferDetails.amount <= 0 || isLoading}>
                        העבר
                    </Button>
                </Stack>
            </ActionCard>

            <ActionCard title="בקשת תשלום">
                <Stack spacing={2}>
                    <TextField label="טלפון מבוקש" value={paymentRequest.phone} onChange={(e) => setPaymentRequest({ ...paymentRequest, phone: e.target.value })} />
                    <TextField type="number" label="סכום" value={paymentRequest.amount} onChange={(e) => setPaymentRequest({ ...paymentRequest, amount: e.target.value })} />
                    <Button variant="contained" color="warning" onClick={() => onApiCall(() => import("../../api/apiService").then(api => api.requestPayment(user, paymentRequest.phone, +paymentRequest.amount)))} disabled={!paymentRequest.phone || !paymentRequest.amount || +paymentRequest.amount <= 0 || isLoading}>
                        בקש תשלום
                    </Button>
                </Stack>
            </ActionCard>
        </Box>
    );
}
