import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./theme";
import AuthForm from "./components/auth/AuthForm";
import DashboardPage from "./components/pages/DashboardPage";
import HistoryPage from "./components/pages/HistoryPage";
import RequestsPage from "./components/pages/RequestsPage";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

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
        <AuthForm onLoginSuccess={setUser} />
      )}
    </ThemeProvider>
  );
}