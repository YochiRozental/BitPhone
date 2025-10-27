import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { logout, setUser } from "./features/auth/authSlice";
import { fetchBalance } from "./features/auth/authThunks";

import theme from "./theme/theme";
import AuthForm from "./components/auth/AuthForm";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import RequestsPage from "./pages/RequestsPage";

export default function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchBalance(user));
  }, [user, dispatch]);

  const handleLogout = () => dispatch(logout());

  return (
    <ThemeProvider theme={theme}>
      {user ? (
        <Router>
          <Routes>
            <Route path="/" element={<DashboardPage user={user} onLogout={handleLogout} />} />
            <Route path="/history" element={<HistoryPage user={user} onLogout={handleLogout} />} />
            <Route path="/requests" element={<RequestsPage user={user} onLogout={handleLogout} />} />
          </Routes>
        </Router>
      ) : (
        <AuthForm onLoginSuccess={(loggedInUser) => dispatch(setUser(loggedInUser))} />
      )}
    </ThemeProvider>
  );
}
