import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#030407] text-white">
      <div className="pointer-events-none absolute left-72 top-0 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-220px] right-[-120px] h-[520px] w-[520px] rounded-full border border-blue-500/[0.08]" />

      <AdminSideBar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <AdminNavbar />

        <main className="flex-1 px-5 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
