import { useState } from "react";
import UserForm from "../../components/dashboard/forms/UserForm";
import { setUser } from "../../features/auth/authSlice";
import { updateUser } from "../../features/auth/authThunks";
import type { User } from "../../types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(s => s.auth);
  const [readOnly, setRO] = useState(true);

  if (!user) return null;

  const save = async (data: User) => {
    const r = await dispatch(updateUser(data)).unwrap();
    dispatch(setUser(r));
    setRO(true);
  };

  return (
    <UserForm
      initialData={user}
      readOnly={readOnly}
      loading={loading}
      onEdit={() => setRO(false)}
      onCancel={() => setRO(true)}
      onSave={save}
    />
  );
}
