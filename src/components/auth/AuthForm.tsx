import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import type { User } from "../../types";
import * as api from "../../api/authApi";

interface AuthFormProps {
    onLoginSuccess: (user: User) => void;
}

export default function AuthForm({ onLoginSuccess }: AuthFormProps) {
    const [isLoginView, setIsLoginView] = useState(true);
    const [form, setForm] = useState({ phone: "", idNum: "", secret: "", name: "", bankNumber: "", branchNumber: "", accountNumber: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const res = await api.authenticateUser(form.phone, form.idNum, form.secret);

        if (res.success) {
            const loggedUser: User = {
                phone: form.phone,
                idNum: form.idNum,
                secret: form.secret,
                name: res.data?.name || "",
                bankAccount: { "accountNumber": "", "bankNumber": "", "branchNumber": "", "accountOwner": "" },
                balance: "",
                role: "user"
            };

            localStorage.setItem("user", JSON.stringify(loggedUser));
            onLoginSuccess(loggedUser);
        } else {
            setError(res.message);
        }

        setIsLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        const res = await api.openAccount(form.phone, form.idNum, form.secret, form.name, form.bankNumber, form.branchNumber, form.accountNumber);
        if (res.success) {
            setMessage("נרשמת בהצלחה! אפשר להתחבר עכשיו.");
            setIsLoginView(true);
        } else {
            setError(res.message);
        }

        setIsLoading(false);
    };

    return (
        <Box display="flex" justifyContent="center" mt={8}>
            <Paper elevation={3} sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={2} textAlign="center">
                    {isLoginView ? "התחברות לחשבון" : "פתיחת חשבון חדש"}
                </Typography>

                <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                    <TextField
                        fullWidth
                        label="מספר טלפון"
                        name="phone"
                        margin="normal"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="תעודת זהות"
                        name="idNum"
                        margin="normal"
                        value={form.idNum}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="קוד סודי"
                        type="password"
                        name="secret"
                        margin="normal"
                        value={form.secret}
                        onChange={handleChange}
                        required
                    />
                    {!isLoginView && (
                        <TextField
                            fullWidth
                            label="שם מלא"
                            name="name"
                            margin="normal"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    )}

                    {error && (
                        <Typography color="error" mt={1}>
                            {error}
                        </Typography>
                    )}
                    {message && (
                        <Typography color="primary" mt={1}>
                            {message}
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "טוען..." : isLoginView ? "התחבר" : "צור חשבון"}
                    </Button>

                    <Button
                        fullWidth
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={() => setIsLoginView(!isLoginView)}
                    >
                        {isLoginView ? "אין לך חשבון? הירשם" : "יש לך חשבון? התחבר"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
