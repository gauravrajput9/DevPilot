import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../../services/problemApi";

const AllProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);

        const data = await getProblems();

        setProblems(data.problems);
      } catch (error) {
        console.error("Failed to fetch problems:", error);

        setError(error.response?.data?.message || "Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading problems...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Problems</h1>

          <p className="mt-2 text-sm text-slate-400">
            Practice real-world development problems and improve your skills.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {problems.map((problem) => (
          <Link
            key={problem._id}
            to={`/problems/${problem._id}`}
            className="block rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium text-white">{problem.title}</h2>

                <p className="mt-1 text-sm text-slate-500">
                  {problem.category}
                </p>
              </div>

              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs capitalize text-slate-400">
                {problem.difficulty}
              </span>
            </div>

            {problem.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllProblems;
