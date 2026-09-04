import api from "./axios";

/* =========================================================
   ADMIN USERS API
========================================================= */

export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const toggleUserBan = async (userId, banned) => {
  const response = await api.patch(`/admin/users/${userId}/ban`, { banned });
  return response.data;
};

/* =========================================================
   ADMIN SUBMISSIONS API
========================================================= */

export const getAdminSubmissions = async (params = {}) => {
  const response = await api.get("/admin/submissions", { params });
  return response.data;
};

export const getAdminSubmissionDetails = async (id) => {
  const response = await api.get(`/admin/submissions/${id}`);
  return response.data;
};

/* =========================================================
   ADMIN ANALYTICS API
========================================================= */

export const getAdminAnalytics = async () => {
  const response = await api.get("/admin/analytics");
  return response.data;
};

/* =========================================================
   ADMIN SETTINGS & DIAGNOSTICS API
========================================================= */

export const getAdminSettings = async () => {
  const response = await api.get("/admin/settings");
  return response.data;
};

export const testPistonHealth = async () => {
  const response = await api.post("/admin/settings/piston-test");
  return response.data;
};
