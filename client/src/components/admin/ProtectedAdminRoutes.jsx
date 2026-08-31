import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../../lib/authClient";

const AdminProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030407] text-white">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
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
