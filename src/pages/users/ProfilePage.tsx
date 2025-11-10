import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { updateUser } from "../../features/auth/authThunks";
import { setUser } from "../../features/auth/authSlice";
import UserForm from "../../components/dashboard/UserForm";
import type { User } from "../../types";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isViewOnly, setIsViewOnly] = useState(true);

  if (!user) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">לא נמצאו נתוני משתמש</Typography>
      </Box>
    );
  }

  const handleSave = async (data: User) => {
    try {
      const result = await dispatch(updateUser(data)).unwrap();
      dispatch(setUser(result));
      setIsViewOnly(true);
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
      mode="profile"
      initialData={user}
      loading={loading}
      isViewOnly={isViewOnly}
      onEdit={() => setIsViewOnly(false)}
      onCancel={() => setIsViewOnly(true)}
      onSubmit={handleSave}
    />
  );
}
