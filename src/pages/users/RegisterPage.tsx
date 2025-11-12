import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { registerUser } from "../../features/auth/authThunks";
import AuthForm from "../../components/forms/AuthForm";

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const submit = async (data: any) => {
        const r = await dispatch(registerUser(data)).unwrap();
        if (r) navigate("/profile");
    };

    return (
        <AuthForm mode="register" onSubmit={submit} onSwitch={() => navigate("/login")} />
    );
}
