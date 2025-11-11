import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    Divider,
} from "@mui/material";
import FormFields from "../forms/FormFields";
import { useUserForm } from "../../../hooks/useUserForm";

interface Props {
    mode: "login" | "register";
    loading?: boolean;
    error?: string;
    onSubmit: (data: any) => void;
    onSwitch: () => void;
}

export default function AuthForm({
    mode,
    loading = false,
    error,
    onSubmit,
    onSwitch,
}: Props) {

    const isReg = mode === "register";

    const { data, errors, onChange, validate } = useUserForm(undefined, isReg);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(data);
    };

    return (
        <Box display="flex" justifyContent="center" py={6} sx={{ bgcolor: "#f5f7fa" }}>
            <Paper sx={{ p: 5, width: "100%", maxWidth: 500, borderRadius: 3 }}>
                <Typography variant="h4" textAlign="center" mb={2}>
                    {isReg ? "פתיחת חשבון" : "התחברות"}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <FormFields
                            data={data}
                            errors={errors}
                            onChange={onChange}
                            showBankFields={isReg}
                        />

                        {error && (
                            <Typography color="error" textAlign="center">
                                {error}
                            </Typography>
                        )}

                        <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                            {isReg ? "צור חשבון" : "התחבר"}
                        </Button>
                    </Stack>
                </form>

                <Divider sx={{ my: 3 }} />
                <Button variant="outlined" fullWidth onClick={onSwitch}>
                    {isReg ? "מעבר להתחברות" : "מעבר להרשמה"}
                </Button>
            </Paper>
        </Box>
    );
}
