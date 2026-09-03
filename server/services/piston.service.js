import axios from "axios";
import { PISTON_LANGUAGES } from "../config/languages.js";

const getPistonUrl = () => {
  return process.env.PISTON_URL || "http://localhost:2000";
};

export const executeCode = async ({
  language,
  sourceCode,
  stdin = "",
}) => {
  const config = PISTON_LANGUAGES[language];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const pistonUrl = getPistonUrl();

  const response = await axios.post(
    `${pistonUrl}/api/v2/execute`,
    {
      language: config.language,
      version: config.version,
      files: [
        {
          name: `main.${config.extension}`,
          content: sourceCode,
        },
      ],
      stdin,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );

  return response.data;
};

