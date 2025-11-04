import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Divider,
    Stack,
    InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LoginIcon from "@mui/icons-material/Login";

import type { User } from "../../types";

interface UserFormProps {
    mode: "register" | "profile" | "edit";
    initialData?: User;
    loading?: boolean;
    onSubmit: (data: User) => void;
    onCancel?: () => void;
    onGoToLogin?: () => void;
}

export default function UserForm({
    mode,
    initialData,
    loading = false,
    onSubmit,
    onCancel,
    onGoToLogin,
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

    const registerSubtitle =
        mode === "register"
            ? "!הצטרפו עכשיו והתחילו לנהל את הכסף שלכם בקלות"
            : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

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

    return (
        <Box
            display="flex"
            justifyContent="center"
            py={4}
            minHeight="100vh"
            alignItems="flex-start"
            sx={{ bgcolor: mode === "register" ? "#f5f5f5" : "inherit" }}
        >
            <Paper
                elevation={8}
                sx={{
                    p: 5,
                    width: "100%",
                    maxWidth: 550,
                    borderRadius: 3,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    bgcolor: "white",
                }}
            >
                <Typography
                    variant="h4"
                    textAlign="center"
                    mb={1}
                    color="primary"
                    fontWeight={600}
                >
                    {title}
                </Typography>

                {registerSubtitle && (
                    <Typography variant="subtitle1" textAlign="center" mb={4} color="text.secondary">
                        {registerSubtitle}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Typography variant="h6" color="text.primary" mt={1}>
                            פרטים אישיים
                        </Typography>
                        <Divider sx={{ mb: 1 }} />

                        <TextField
                            label="שם מלא"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="טלפון"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="תעודת זהות"
                            name="idNum"
                            value={form.idNum}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Typography variant="h6" color="text.primary" mt={2}>
                            פרטי חשבון בנק
                        </Typography>
                        <Divider sx={{ mb: 1 }} />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="מספר בנק"
                                name="bankNumber"
                                value={form.bankAccount.bankNumber}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={isViewOnly}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="מספר סניף"
                                name="branchNumber"
                                value={form.bankAccount.branchNumber}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={isViewOnly}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <VpnKeyIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>

                        <TextField
                            label="מספר חשבון"
                            name="accountNumber"
                            value={form.bankAccount.accountNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCardIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="שם בעל החשבון"
                            name="accountOwner"
                            value={form.bankAccount.accountOwner}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isViewOnly}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalanceIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Stack>

                    <Box display="flex" justifyContent="center" gap={3} mt={5}>
                        {isViewOnly ? (
                            <Button
                                variant="contained"
                                onClick={onCancel}
                                color="primary"
                                size="large"
                                sx={{ px: 4, py: 1.5 }}
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
                                    size="large"
                                    sx={{ px: 5, py: 1.5 }}
                                >
                                    {loading
                                        ? "שומר..."
                                        : mode === "register"
                                            ? "✅ צור חשבון והתחל עכשיו"
                                            : "שמור שינויים"}

                                </Button>
                                {onCancel && (
                                    <Button
                                        variant="text"
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

                {mode === "register" && onGoToLogin && (
                    <Box textAlign="center" mt={3}>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            כבר יש לך חשבון?
                        </Typography>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onGoToLogin}
                            startIcon={<LoginIcon />}
                            size="medium"
                        >
                            עבור לדף ההתחברות
                        </Button>
                    </Box>
                )}

            </Paper>
        </Box>
    );
}