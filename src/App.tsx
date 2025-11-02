import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { logout, setUser } from "./features/auth/authSlice";
import { fetchBalance } from "./features/auth/authThunks";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/he';

import theme from "./theme/theme";
import AuthForm from "./components/auth/AuthForm";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import RequestsPage from "./pages/RequestsPage";
import BalancePage from "./pages/BalancePage";
import SentRequestsPage from "./pages/SentRequestsPage";
import AdminUsersPage from "./components/admin/AdminUsersPage";

import MainLayout from "./components/layout/MainLayout";

export default function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchBalance(user));
  }, [user, dispatch]);

  const handleLogout = () => dispatch(logout());

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
        {user ? (
          <Router>
            <MainLayout onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<DashboardPage user={user} onLogout={handleLogout} />} />
                <Route path="/balance" element={<BalancePage user={user} onLogout={handleLogout} />} />
                <Route path="/history" element={<HistoryPage user={user} onLogout={handleLogout} />} />
                <Route path="/requests" element={<RequestsPage user={user} onLogout={handleLogout} />} />
                <Route path="/sent-requests" element={<SentRequestsPage user={user} onLogout={handleLogout} />} />
                <Route path="/admin/users" element={<AdminUsersPage user={user} />} />
              </Routes>
            </MainLayout>
          </Router>
        ) : (
          <AuthForm onLoginSuccess={(loggedInUser) => dispatch(setUser(loggedInUser))} />
        )}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
