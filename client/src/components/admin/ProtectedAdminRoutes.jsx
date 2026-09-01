import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../../lib/authClient";
import { PageLoading } from "../ui/PageState";

const AdminProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030407] text-white">
        <PageLoading label="Checking admin access..." />
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }


  if (session.user.role !== "admin") {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
};

export default AdminProtectedRoute;
