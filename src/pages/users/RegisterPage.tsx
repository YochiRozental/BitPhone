import { useAppDispatch } from "../../app/hooks";
import { registerUser } from "../../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import UserForm from "../../components/dashboard/UserForm";
import type { User } from "../../types";

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRegister = async (data: User) => {
        try {
            const result = await dispatch(registerUser(data)).unwrap();
            if (result) navigate("/profile");
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    const handleGoToLogin = () => {
        navigate("/login");
    };

    return <UserForm mode="register" onSubmit={handleRegister} onGoToLogin={handleGoToLogin} />;
}
