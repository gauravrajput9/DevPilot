import { executeCode } from "../sevices/piston.services.js";
export const runCode = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const {
      language,
      sourceCode,
      stdin = "",
    } = req.body;

    if (!language || !sourceCode) {
      return res.status(400).json({
        message: "Language and source code are required",
      });
    }

    const result = await executeCode({
      language,
      sourceCode,
      stdin,
    });

    const run = result.run;

    return res.status(200).json({
      success: true,
      output: run.output ?? "",
      stdout: run.stdout ?? "",
      stderr: run.stderr ?? "",
      status: run.status,
      code: run.code,
      signal: run.signal,
      memory: run.memory,
      cpuTime: run.cpu_time,
      wallTime: run.wall_time,
    });
  } catch (error) {
    console.error(
      "Run code error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Code execution failed",
    });
  }
};