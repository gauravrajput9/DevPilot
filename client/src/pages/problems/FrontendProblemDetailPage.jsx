import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FrontendWorkspace from "../../components/frontendProblems/FrontendWorkspace";

const FrontendProblemDetailPage = () => {
  const { id } = useParams();

  // const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // Later:
        // const response = await getProblemById(id);
        // setProblem(response.data);

        console.log("Frontend problem:", id);
      } catch (error) {
        console.error("Failed to load problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      {/* Problem description */}

      <div className="min-h-0 flex-1 p-4">
        <FrontendWorkspace />
      </div>
    </div>
  );
};

export default FrontendProblemDetailPage;