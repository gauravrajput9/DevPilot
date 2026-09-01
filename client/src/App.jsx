import { Routes, BrowserRouter, Route } from "react-router-dom";

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
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { ToastProvider } from "./components/ui/ToastProvider";
import NotFound from "./pages/NotFound";
import CreateTestCase from "./pages/admin/CreateTestCases";

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public/User Routes */}
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/features" element={<Features />} />

            <Route path="/problems" element={<ProblemsPage />} />

            <Route path="/problems/coding" element={<CodingProblemsPage />} />

            <Route path="/problems/frontend" element={<FrontendProblemsPage />} />

            <Route path="/problems/backend" element={<BackendProblemsPage />} />

            <Route path="/problems/:id" element={<ProblemDetailPage />} />

            {/* Admin Routes */}
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                {/* /admin/problems */}
                <Route path="problems" element={<AdminProblems />} />

                {/* /admin/problems/create */}
                <Route path="problems/create" element={<CreateProblem />} />

                {/* /admin/problems/:problemId */}
                <Route path="problems/:problemId" element={<EditProblem />} />

                {/* /admin/problems/:problemId/testcases */}
                <Route
                  path="problems/:problemId/testcases"
                  element={<ManageTestCases />}
                />
                <Route
                  path="problems/:problemId/testcases/manage"
                  element={<CreateTestCase />}
                />
              </Route>
              
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
