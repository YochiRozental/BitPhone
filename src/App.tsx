import { useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="App">
      <header>
        <h1>מערכת ניהול בנק</h1>
      </header>
      <main>
        {user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <AuthForm onLoginSuccess={setUser} />}
      </main>
    </div>
  );
}
