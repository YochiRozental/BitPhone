import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/he";

import { useAppSelector, useAppDispatch } from "./app/hooks";
import { logout } from "./features/auth/authSlice";

import theme from "./theme/theme";
import MainLayout from "./components/layout/MainLayout";

import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import RequestsPage from "./pages/RequestsPage";
import BalancePage from "./pages/BalancePage";
import SentRequestsPage from "./pages/SentRequestsPage";
import AdminUsersPage from "./components/admin/AdminUsersPage";

import RegisterPage from "./pages/users/RegisterPage";
import LoginPage from "./pages/users/LoginPage";
import ProfilePage from "./pages/users/ProfilePage";

export default function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
        <Router>
          <Routes>
            <Route
              path="/register"
              element={!user ? <RegisterPage /> : <Navigate to="/account-actions" replace />}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/account-actions" replace />}
            />

            <Route
              path="/*"
              element={
                user ? (
                  <MainLayout onLogout={handleLogout}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/account-actions" replace />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route
                        path="/account-actions"
                        element={<DashboardPage user={user} onLogout={handleLogout} />}
                      />
                      <Route
                        path="/balance"
                        element={<BalancePage user={user} onLogout={handleLogout} />}
                      />
                      <Route
                        path="/history"
                        element={<HistoryPage user={user} onLogout={handleLogout} />}
                      />
                      <Route
                        path="/requests"
                        element={<RequestsPage user={user} onLogout={handleLogout} />}
                      />
                      <Route
                        path="/sent-requests"
                        element={<SentRequestsPage user={user} onLogout={handleLogout} />}
                      />
                      <Route
                        path="/admin/users"
                        element={<AdminUsersPage user={user} />}
                      />
                      <Route path="*" element={<Navigate to="/account-actions" replace />} />
                    </Routes>
                  </MainLayout>
                ) : (
                  <Navigate to="/register" replace />
                )
              }
            />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
