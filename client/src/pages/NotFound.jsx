import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030407] px-6 text-white">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01]"
          >
            <Home size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
