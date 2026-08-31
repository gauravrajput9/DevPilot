import api from "./axios";

export const getProblems = async (params = {}) => {
  const response = await api.get("/problems", { params });

  return response.data;
};

export const getProblem = async (id) => {
  const response = await api.get(`/problems/${id}`);

  return response.data;
};


//?? Admin Api Calls
export const createProblem = async (formData) => {
  try {
    const res = await api.post("/admin/problems", formData);

    return res.data;
  } catch (error) {
    console.log(
      "Axios Create Problem Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getAdminProblems = async () => {
  try {
    const res = await api.get("/admin/problems");

    return res.data;
  } catch (error) {
    console.log(
      "Axios Get Admin Problems Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};