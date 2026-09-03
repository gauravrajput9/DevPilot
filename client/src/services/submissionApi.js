import api from "./axios";

export const runCode = async ({
  language,
  sourceCode,
  stdin = "",
}) => {
  const response = await api.post("/submissions/run", {
    language,
    sourceCode,
    stdin,
  });

  return response.data;
};

export const submitCode = async ({
  problemId,
  language,
  sourceCode,
}) => {
  const response = await api.post("/submissions/submit", {
    problemId,
    language,
    sourceCode,
  });

  return response.data;
};

export const getUserSubmissions = async () => {
  const response = await api.get("/submissions/user");
  return response.data;
};

export const getSubmissionsForProblem = async (problemId) => {
  const response = await api.get(`/submissions/coding/problem/${problemId}`);
  return response.data;
};