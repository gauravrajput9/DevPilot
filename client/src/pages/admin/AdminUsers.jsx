import { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
} from "lucide-react";
import { getAdminUsers, updateUserRole, toggleUserBan } from "../../services/adminApi";
import { useToast } from "../../components/ui/ToastProvider";
import { PageLoading, PageError } from "../../components/ui/PageState";

const AdminUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Action Loading
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    let ignore = false;
    const params = {
      page: currentPage,
      limit: 20,
      search: searchTerm,
      role: selectedRole,
      status: selectedStatus,
    };

    getAdminUsers(params)
      .then((res) => {
        if (!ignore && res.success) {
          setUsers(res.users || []);
          setPagination(res.pagination || { total: 0, page: currentPage, limit: 20, totalPages: 1 });
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load users:", err);
          const msg = err.response?.data?.message || err.message || "Failed to load users";
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentPage, searchTerm, selectedRole, selectedStatus, reloadKey, toast]);

  const handleRefresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handlePageChange = (newPage) => {
    setLoading(true);
    setCurrentPage(newPage);
  };

  const handleRoleFilterChange = (val) => {
    setLoading(true);
    setSelectedRole(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setLoading(true);
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setLoading(true);
    setCurrentPage(1);
    setReloadKey((k) => k + 1);
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const confirmMsg =
      newRole === "admin"
        ? "Are you sure you want to promote this user to Administrator?"
        : "Are you sure you want to demote this user to standard User?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoadingId(userId);
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        toast.success(res.message || `Role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error("Role update failed:", err);
      toast.error(err.response?.data?.message || "Failed to change user role");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBanToggle = async (userId, currentBanned) => {
    const nextBanned = !currentBanned;
    const confirmMsg = nextBanned
      ? "Are you sure you want to BAN this user? They will lose platform access."
      : "Are you sure you want to UNBAN this user?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoadingId(userId);
      const res = await toggleUserBan(userId, nextBanned);
      if (res.success) {
        toast.success(res.message || (nextBanned ? "User banned" : "User unbanned"));
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, banned: nextBanned } : u))
        );
      }
    } catch (err) {
      console.error("Ban update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update ban status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalCount = pagination.total;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const bannedCount = users.filter((u) => u.banned).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            User Administration
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage user permissions, review learner profiles, and configure platform access.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">Total Registered</p>
              <p className="text-xl font-bold text-white">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">Administrators</p>
              <p className="text-xl font-bold text-white">{adminCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">Banned Accounts</p>
              <p className="text-xl font-bold text-white">{bannedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        {/* Search */}
        <div className="relative min-w-[260px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-4 text-xs text-white placeholder:text-zinc-600 focus:border-violet-500/50 outline-none"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleFilterChange(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#08090d] px-3 text-xs text-white outline-none focus:border-violet-500/50"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-[#08090d] px-3 text-xs text-white outline-none focus:border-violet-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <PageLoading label="Loading users..." />
      ) : error ? (
        <PageError title="Failed to load users" message={error} onAction={handleRefresh} />
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-zinc-500">
            <Users size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">No users found</h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-500">
            No registered users match your current search and filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Submissions</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {users.map((u) => {
                  const isAdmin = u.role === "admin";
                  const isBanned = u.banned;
                  const isBusy = actionLoadingId === u.id;

                  return (
                    <tr key={u.id} className="transition hover:bg-white/[0.02]">
                      {/* User Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img src={u.image} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 font-bold text-white text-xs">
                              {u.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{u.name}</p>
                            <p className="text-zinc-500 text-[11px] truncate flex items-center gap-1">
                              <Mail size={11} /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                            isAdmin
                              ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                              : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                          }`}
                        >
                          {isAdmin ? <ShieldCheck size={12} /> : null}
                          {isAdmin ? "Admin" : "Learner"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                            isBanned
                              ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isBanned ? "bg-rose-400" : "bg-emerald-400"
                            }`}
                          />
                          {isBanned ? "Banned" : "Active"}
                        </span>
                      </td>

                      {/* Submissions count */}
                      <td className="px-5 py-4">
                        <span className="font-mono font-medium text-zinc-300">
                          {u.submissionCount ?? 0}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 text-zinc-400">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar size={12} className="text-zinc-600" />
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={isBusy}
                            onClick={() => handleRoleChange(u.id, u.role)}
                            className={`rounded-lg border px-3 py-1 text-[11px] font-medium transition ${
                              isAdmin
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                                : "border-violet-500/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
                            }`}
                          >
                            {isAdmin ? "Demote" : "Promote Admin"}
                          </button>

                          <button
                            disabled={isBusy}
                            onClick={() => handleBanToggle(u.id, u.banned)}
                            className={`rounded-lg border px-3 py-1 text-[11px] font-medium transition ${
                              isBanned
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                : "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                            }`}
                          >
                            {isBanned ? "Unban" : "Ban"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 text-xs text-zinc-400">
            <span>
              Showing {users.length} of {pagination.total} users
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-medium text-white">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
