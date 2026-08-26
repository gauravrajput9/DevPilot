import api from "./axios";

export const getProblems = async () => {
  const response = await api.get("/problems");

  return response.data;
};

export const getProblem = async (id) => {
  const response = await api.get(`/problems/${id}`);

  return response.data;
};