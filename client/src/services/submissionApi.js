import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const runCode = async ({
  language,
  sourceCode,
  stdin = "",
}) => {
  const response = await axios.post(
    `${API_URL}/submissions/run`,
    {
      language,
      sourceCode,
      stdin,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};