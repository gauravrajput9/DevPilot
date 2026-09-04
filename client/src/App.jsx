import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignupPage";
import Features from "./pages/Features";

import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/problems/ProblemDetailPage";
import CodingProblemsPage from "./pages/problems/CodingProblemsPage";
import FrontendProblemsPage from "./pages/problems/FrontendProblemsPage";
import BackendProblemsPage from "./pages/problems/BackendProblemsPage";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/ProtectedAdminRoutes";
import AdminProblems from "./pages/admin/AdminProblems";
import CreateProblem from "./pages/admin/CreateProblem";
import EditProblem from "./pages/admin/EditProblem";
import ManageTestCases from "./pages/admin/ManageTestCases";
import CreateTestCase from "./pages/admin/CreateTestCases";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

import ErrorBoundary from "./components/ui/ErrorBoundary";
import { ToastProvider } from "./components/ui/ToastProvider";
import NotFound from "./pages/NotFound";
import FrontendProblemDetailPage from "./pages/problems/FrontendProblemDetailPage";

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* ==================== Public/User Routes ==================== */}

            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/Home" element={<Navigate to="/" replace />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/features" element={<Features />} />

            {/* ==================== Problems ==================== */}

            {/* Practice Area Selection */}
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/Problems" element={<Navigate to="/problems" replace />} />
            <Route path="/Problems/*" element={<Navigate to="/problems" replace />} />

            {/* ---------- Coding Problems ---------- */}
            <Route
              path="/problems/coding"
              element={<CodingProblemsPage />}
            />

            <Route
              path="/problems/coding/:id"
              element={<ProblemDetailPage />}
            />

            {/* ---------- Frontend Problems ---------- */}
            <Route
              path="/problems/frontend"
              element={<FrontendProblemsPage />}
            />

            <Route
              path="/problems/frontend/:id"
              element={<FrontendProblemDetailPage />}
            />

            {/* ---------- Backend Problems ---------- */}
            <Route
              path="/problems/backend"
              element={<BackendProblemsPage />}
            />

            <Route
              path="/problems/backend/:id"
              element={<ProblemDetailPage />}
            />

            {/* Generic problem detail fallback */}
            <Route
              path="/problems/:id"
              element={<ProblemDetailPage />}
            />

            {/* ==================== Admin Routes ==================== */}

            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                {/* /admin */}
                <Route index element={<AdminDashboard />} />

                {/* /admin/problems */}
                <Route
                  path="problems"
                  element={<AdminProblems />}
                />

                {/* /admin/problems/create */}
                <Route
                  path="problems/create"
                  element={<CreateProblem />}
                />

                {/* /admin/problems/:problemId */}
                <Route
                  path="problems/:problemId"
                  element={<EditProblem />}
                />

                {/* /admin/problems/:problemId/testcases */}
                <Route
                  path="problems/:problemId/testcases"
                  element={<ManageTestCases />}
                />

                {/* /admin/problems/:problemId/testcases/manage */}
                <Route
                  path="problems/:problemId/testcases/manage"
                  element={<CreateTestCase />}
                />

                {/* /admin/submissions */}
                <Route
                  path="submissions"
                  element={<AdminSubmissions />}
                />

                {/* /admin/users */}
                <Route
                  path="users"
                  element={<AdminUsers />}
                />

                {/* /admin/analytics */}
                <Route
                  path="analytics"
                  element={<AdminAnalytics />}
                />

                {/* /admin/settings */}
                <Route
                  path="settings"
                  element={<AdminSettings />}
                />
              </Route>
            </Route>

            {/* ==================== 404 ==================== */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;