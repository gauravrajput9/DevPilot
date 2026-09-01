import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { authClient } from "../../lib/authClient";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();

    window.location.href = "/login";
  };

  if (isPending) {
    return (
      <header className="flex h-16 items-center border-b border-white/[0.07] bg-[#030407]/80 px-6 backdrop-blur-xl">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
      </header>
    );
  }

  const user = session?.user;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#030407]/80 px-5 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-500/10">
          <ShieldCheck size={20} />
        </div>

        <Link to={`/`} >
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight">
              DevPilot
            </h1>

            <p className="text-xs font-medium text-violet-300/80">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-violet-500/30 hover:bg-white/[0.07] hover:text-white">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2 py-1.5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs capitalize text-zinc-500">
              {user?.role || "Administrator"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-sm font-bold shadow-lg shadow-violet-600/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
