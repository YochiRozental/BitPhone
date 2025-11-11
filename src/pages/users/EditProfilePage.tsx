import { useAppDispatch, useAppSelector } from "../../app/hooks";
import UserForm from "../../components/dashboard/forms/UserForm";
import { updateUser } from "../../features/auth/authThunks";

export default function EditProfilePage() {
    const user = useAppSelector((s) => s.auth.user);
    const dispatch = useAppDispatch();

    if (!user) return null;

    return (
        <UserForm
            initialData={user}
            readOnly={false}
            onEdit={() => { }}
            onCancel={() => (window.location.href = "/profile")}
            onSave={(d) => dispatch(updateUser(d))}
        />
    );
}
