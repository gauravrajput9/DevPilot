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

export const deleteProblem = async (problemId) => {
  try {
    const res = await api.delete(`/admin/problems/${problemId}`);

    console.log(res.data);

    return res.data;
  } catch (error) {
    console.log("Error Delete Problem:", error);
    throw error;
  }
};

export const updateProblem = async (problemId, payload) => {
  try {
    const res = await api.put("/admin/problems/update", { problemId, payload });

    return res.data;
  } catch (error) {
    console.log("Error Update Problems: ", error);
    throw error;
  }
};

export const getProblemTestCases = async (problemId) => {
  try {
    const res = await api.get(
      `/admin/problems/${problemId}/testcases`
    );

    return res.data;
  } catch (error) {
    console.log("Problem Test Case fetch error:", error);
    throw error;
  }
};

export const createTestCaseApi = async (problemId, payload) => {
  try {
    const res = await api.post(
      `/admin/problems/${problemId}/testcases`,
      payload
    );
    return res.data;
  } catch (error) {
    console.log("Problem Test Case Creation error:", error);
    throw error;
  }
}

export const deleteTestCaseApi = async (
  problemId,
  testCaseId
) => {
  try {
    const res = await api.delete(
      `/admin/problems/${problemId}/testcases/${testCaseId}`
    );

    return res.data;
  } catch (error) {
    console.log("Delete Test Case error:", error);
    throw error;
  }
};

export const updateTestCaseApi = async (
  problemId,
  testCaseId,
  payload
) => {
  try {
    const res = await api.patch(
      `/admin/problems/${problemId}/testcases/${testCaseId}`,
      payload
    );

    return res.data;
  } catch (error) {
    console.log("Update Test Case error:", error);
    throw error;
  }
};
