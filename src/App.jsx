import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import Pricing from "./SaasPage/Pricing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./SaasPage/LandingPage";
import Login from "./SaasPage/Login";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
