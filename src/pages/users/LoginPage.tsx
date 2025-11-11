import { useState } from "react";
import AuthForm from "../../components/dashboard/forms/AuthForm";
import { loginUser } from "../../features/auth/authThunks";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [err, setErr] = useState("");

    const submit = async (data: any) => {
        try {
            const r = await dispatch(loginUser(data)).unwrap();
            if (r) navigate("/profile");
        } catch (e: any) {
            setErr(e || "שגיאה בהתחברות");
        }
    };

    return (
        <AuthForm mode="login" onSubmit={submit} error={err} onSwitch={() => navigate("/register")} />
    );
}
