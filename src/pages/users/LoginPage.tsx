import { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { loginUser } from "../../features/auth/authThunks";
import UserForm from "../../components/dashboard/UserForm";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [idNum, setIdNum] = useState("");
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showProfile, setShowProfile] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await dispatch(loginUser({ phone, idNum, secret })).unwrap();
            if (result) {                
                setProfileData(result);
                setShowProfile(true);
            }
        } catch (err: any) {
            setError(err || "שגיאה בהתחברות");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = (updatedData: any) => {
        console.log("שמירת פרופיל חדש:", updatedData);
        setProfileData(updatedData);
    };

    if (showProfile && profileData) {
        return (
            <UserForm
                mode="profile"
                initialData={profileData}
                onSubmit={handleProfileUpdate}
                onCancel={() => setShowProfile(false)}
            />
        );
    }

    return (
        <Box display="flex" justifyContent="center" mt={8}>
            <Paper elevation={3} sx={{ p: 5, width: 400, borderRadius: 4 }}>
                <Typography variant="h5" textAlign="center" mb={3} color="primary">
                    התחברות לחשבון
                </Typography>

                <form onSubmit={handleLogin}>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="טלפון"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="תעודת זהות"
                            value={idNum}
                            onChange={(e) => setIdNum(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="קוד סודי"
                            type="password"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            required
                        />

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? "מתחבר..." : "התחבר"}
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => navigate("/register")}
                        >
                            עדיין לא רשום? צור חשבון
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
