import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Divider,
    Stack,
} from "@mui/material";
import type { User } from "../../types";

interface UserFormProps {
    mode: "register" | "profile" | "edit";
    initialData?: User;
    loading?: boolean;
    onSubmit: (data: User) => void;
    onCancel?: () => void;
}

export default function UserForm({
    mode,
    initialData,
    loading = false,
    onSubmit,
    onCancel,
}: UserFormProps) {
    const [form, setForm] = useState<User>(
        initialData || {
            name: "",
            phone: "",
            idNum: "",
            secret: "",
            bankAccount: {
                accountNumber: "",
                bankNumber: "",
                branchNumber: "",
                accountOwner: "",
            },
            balance: "0",
            role: "user",
        }
    );

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    const isViewOnly = mode === "profile";
    const title =
        mode === "register"
            ? "פתיחת חשבון חדש"
            : mode === "edit"
                ? "עריכת פרטים"
                : "הפרופיל שלי";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (["accountNumber", "bankNumber", "branchNumber", "accountOwner"].includes(name)) {
            setForm((prev) => ({
                ...prev,
                bankAccount: { ...prev.bankAccount, [name]: value },
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
                bankAccount:
                    name === "name"
                        ? { ...prev.bankAccount, accountOwner: value }
                        : prev.bankAccount,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Box display="flex" justifyContent="center" mt={6}>
            <Paper
                elevation={4}
                sx={{
                    p: 5,
                    width: "100%",
                    maxWidth: 520,
                    borderRadius: 4,
                    bgcolor: "#fefefe",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                }}
            >
                <Typography variant="h5" textAlign="center" mb={3} color="primary">
                    {title}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="שם מלא"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />
                        <TextField
                            label="טלפון"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />
                        <TextField
                            label="תעודת זהות"
                            name="idNum"
                            value={form.idNum}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />
                        <TextField
                            label="קוד סודי"
                            name="secret"
                            type="password"
                            value={form.secret}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />

                        <Divider sx={{ my: 2 }}>פרטי חשבון בנק</Divider>

                        <TextField
                            label="מספר חשבון"
                            name="accountNumber"
                            value={form.bankAccount.accountNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />
                        <TextField
                            label="מספר סניף"
                            name="branchNumber"
                            value={form.bankAccount.branchNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />
                        <TextField
                            label="מספר בנק"
                            name="bankNumber"
                            value={form.bankAccount.bankNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />
                        <TextField
                            label="שם בעל החשבון"
                            name="accountOwner"
                            value={form.bankAccount.accountOwner}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                        />

                        <TextField
                            label="יתרה נוכחית"
                            value={`${form.balance} ₪`}
                            fullWidth
                            disabled
                        />
                    </Stack>

                    <Box display="flex" justifyContent="center" gap={2} mt={4}>
                        {isViewOnly ? (
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                color="primary"
                            >
                                ערוך פרטים
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "שומר..."
                                        : mode === "register"
                                            ? "צור חשבון"
                                            : "שמור שינויים"}
                                </Button>
                                {onCancel && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={onCancel}
                                    >
                                        ביטול
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
