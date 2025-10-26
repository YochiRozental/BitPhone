import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Layout from "./Layout";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import type { User } from "./types";
import { Button } from "@mui/material";


export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const siteTitle = "מערכת בנק דיגיטלי 🏦";

  const welcomeGreeting = user
    ? `ברוך הבא${user.name ? `, ${user.name}` : ''}`
    : '';

  const AuthButton = user ? (
    <Button
      variant="outlined"
      color="inherit"
      size="small"
      onClick={() => setUser(null)}
    >
      התנתק
    </Button>
  ) : (
    <Button
      variant="outlined"
      color="inherit"
      size="small"
    >
      התחברות
    </Button>
  );

  return (
    <ThemeProvider theme={theme}>
      <Layout authButton={AuthButton} title={siteTitle} greeting={welcomeGreeting}>
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <AuthForm onLoginSuccess={setUser} />
        )}
      </Layout>
    </ThemeProvider>
  );
}
