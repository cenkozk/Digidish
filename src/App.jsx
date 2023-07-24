import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./SaasPage/LandingPage";
import Login from "./SaasPage/Login";
import Dashboard from "./Dashboard/Dashboard";
import { useState } from "react";
import Menu from "./Menu/Menu";

function App() {
  const [session, setSession] = useState({});
  const [user, setUser] = useState({
    user_metadata: {
      avatar_url: "",
      email: "",
      email_verified: null,
      full_name: "",
      iss: "",
      name: "",
      picture: "",
      provider_id: "",
      sub: "",
    },
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={<Dashboard user={user} setUser={setUser} />}
        />
        <Route path="/:restaurantId" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
