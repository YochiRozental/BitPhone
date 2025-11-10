import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import UserForm from "../../components/dashboard/UserForm";
import { updateUser } from "../../features/auth/authThunks";

export default function EditProfilePage() {
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <UserForm
            mode="edit"
            initialData={user || undefined}
            onSubmit={(data) => dispatch(updateUser(data))}
            onCancel={() => (window.location.href = "/profile")}
        />
    );
}
