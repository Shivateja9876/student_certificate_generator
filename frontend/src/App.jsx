import { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import "./main.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return loggedIn ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
