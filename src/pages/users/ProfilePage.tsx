import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { updateUser } from "../../features/auth/authThunks";
import { setUser } from "../../features/auth/authSlice";
import UserForm from "../../components/dashboard/UserForm";
import type { User } from "../../types";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading } = useAppSelector((state) => state.auth);
    const [mode, setMode] = useState<"profile" | "edit">("profile");

    if (!user) {
        return (
            <Box textAlign="center" mt={10}>
                <Typography variant="h6">לא נמצאו נתוני משתמש</Typography>
            </Box>
        );
    }

    if (user && (!user.bankAccount?.accountNumber || !user.name)) {
        navigate("/register");
    }

    const handleEdit = () => {
        setMode("edit");
    };

    const handleCancel = () => {
        setMode("profile");
    };

    const handleSave = async (data: User) => {
        try {
            const result = await dispatch(updateUser(data)).unwrap();
            dispatch(setUser(result));
            setMode("profile");
            console.log("Saving user", result);
        } catch (err) {
            console.error("עדכון נכשל:", err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <UserForm
            mode={mode}
            initialData={user}
            loading={loading}
            onSubmit={handleSave}
            onCancel={mode === "profile" ? handleEdit : handleCancel}
        />
    );
}
