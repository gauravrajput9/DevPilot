import {
  LayoutDashboard,
  Code2,
  Plus,
  FileCode2,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/authClient";

const AdminSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "border border-violet-500/30 bg-violet-500/15 text-white shadow-lg shadow-violet-600/10"
        : "border border-transparent text-zinc-500 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-zinc-200"
    }`;

  return (
    <aside className="relative z-20 flex min-h-screen w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#050609]/95 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b border-white/[0.07] px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Dev<span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Pilot</span>
          </h1>
          <p className="mt-0.5 text-xs font-semibold tracking-[0.18em] text-zinc-600">
            ADMIN PANEL
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">

        <NavLink to="/admin" end className={navClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <div className="px-4 pb-2 pt-5 text-xs font-semibold tracking-[0.18em] text-zinc-700">
          PROBLEMS
        </div>

        <NavLink to="/admin/problems" className={navClass}>
          <Code2 size={20} />
          Problems
        </NavLink>

        <NavLink to="/admin/problems/create" className={navClass}>
          <Plus size={20} />
          Create Problem
        </NavLink>

        <div className="px-4 pb-2 pt-5 text-xs font-semibold tracking-[0.18em] text-zinc-700">
          PLATFORM
        </div>

        <NavLink to="/admin/submissions" className={navClass}>
          <FileCode2 size={20} />
          Submissions
        </NavLink>

        <NavLink to="/admin/users" className={navClass}>
          <Users size={20} />
          Users
        </NavLink>

        <NavLink to="/admin/analytics" className={navClass}>
          <BarChart3 size={20} />
          Analytics
        </NavLink>

        <div className="px-4 pb-2 pt-5 text-xs font-semibold tracking-[0.18em] text-zinc-700">
          SYSTEM
        </div>

        <NavLink to="/admin/settings" className={navClass}>
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

      <div className="border-t border-white/[0.07] p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSideBar;
