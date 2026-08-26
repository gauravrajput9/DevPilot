import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignupPage";
import Features from "./pages/Features";
import ProblemPage from "./pages/problems/ProblemPage";
import AllProblems from "./components/problems/AllProblems";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/features" element={<Features />} />

        <Route path="/problems" element={<AllProblems/>} />

        <Route path="/problems/:id" element={<ProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
