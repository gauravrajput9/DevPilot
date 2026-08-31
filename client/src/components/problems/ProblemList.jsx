import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getProblems } from "../../services/problemApi";

const difficultyOptions = ["all", "easy", "medium", "hard"];
const problemTypeOptions = ["all", "single-file", "multi-file"];
const languageOptions = ["all", "javascript", "python", "cpp"];

const defaultCategoryOptions = {
  coding: ["arrays", "strings", "linked lists", "stacks", "trees", "graphs"],
  frontend: ["react", "jsx", "components", "state", "apis", "ui"],
  backend: ["rest api", "node.js", "express", "mongodb", "authentication", "crud"],
};

const formatLabel = (value) => {
  if (!value) return "";
  if (value === "cpp") return "C++";
  if (value === "javascript") return "JavaScript";
  if (value === "rest api") return "REST API";
  if (value === "node.js") return "Node.js";
  if (value === "apis") return "APIs";

  return value
    .split("-")
    .join(" ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const FilterButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "border-slate-500 bg-slate-800 text-white"
        : "border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300"
    }`}
  >
    {children}
  </button>
);

const ProblemList = ({ practiceType, title, description }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedProblemType, setSelectedProblemType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProblems({ practiceType });
        setProblems(data.problems || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load problems.");
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, [practiceType]);

  const categoryOptions = useMemo(() => {
    const categories = problems.map((problem) => problem.category).filter(Boolean);
    const defaults = defaultCategoryOptions[practiceType] || [];

    return ["all", ...new Set([...defaults, ...categories])];
  }, [practiceType, problems]);

  const filteredProblems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return problems.filter((problem) => {
      const searchableText = [
        problem.title,
        problem.description,
        problem.category,
        ...(problem.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory =
        selectedCategory === "all" || problem.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
      const matchesProblemType =
        selectedProblemType === "all" || problem.problemType === selectedProblemType;
      const matchesLanguage =
        selectedLanguage === "all" ||
        (problem.supportedLanguages || []).includes(selectedLanguage);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesProblemType &&
        matchesLanguage
      );
    });
  }, [
    problems,
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedProblemType,
    selectedLanguage,
  ]);

  const groupedProblems = useMemo(() => {
    const groupBy = practiceType === "coding" ? "category" : "problemType";

    return filteredProblems.reduce((groups, problem) => {
      const groupName = problem[groupBy] || "uncategorized";
      const existingGroup = groups[groupName] || [];

      return {
        ...groups,
        [groupName]: [...existingGroup, problem],
      };
    }, {});
  }, [filteredProblems, practiceType]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10">
          <Link
            to="/problems"
            className="text-xs font-medium text-slate-500 transition hover:text-slate-300"
          >
            Back to practice areas
          </Link>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <section className="mb-8 space-y-6 border-y border-slate-800 py-6">
          <div className="relative max-w-xl">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search problems..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-slate-600"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-slate-600">Category</p>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <FilterButton
                    key={category}
                    active={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {formatLabel(category)}
                  </FilterButton>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase text-slate-600">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {difficultyOptions.map((difficulty) => (
                  <FilterButton
                    key={difficulty}
                    active={selectedDifficulty === difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {formatLabel(difficulty)}
                  </FilterButton>
                ))}
              </div>
            </div>

            {practiceType === "coding" ? (
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-slate-600">Language</p>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((language) => (
                    <FilterButton
                      key={language}
                      active={selectedLanguage === language}
                      onClick={() => setSelectedLanguage(language)}
                    >
                      {formatLabel(language)}
                    </FilterButton>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-slate-600">
                  Problem Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {problemTypeOptions.map((problemTypeOption) => (
                    <FilterButton
                      key={problemTypeOption}
                      active={selectedProblemType === problemTypeOption}
                      onClick={() => setSelectedProblemType(problemTypeOption)}
                    >
                      {formatLabel(problemTypeOption)}
                    </FilterButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {loading && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/30 px-5 py-4 text-sm text-slate-500">
            Loading problems...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && filteredProblems.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/30 px-5 py-4 text-sm text-slate-500">
            No problems match these filters.
          </div>
        )}

        {!loading && !error && filteredProblems.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedProblems).map(([groupName, groupProblems]) => (
              <section key={groupName}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {formatLabel(groupName)}
                </h2>

                <div className="overflow-hidden rounded-lg border border-slate-800">
                  {groupProblems.map((problem) => (
                    <Link
                      key={problem._id}
                      to={`/problems/${problem._id}`}
                      className="group flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-5 py-4 transition last:border-b-0 hover:bg-slate-900"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-medium text-slate-200">
                          {problem.title}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                          {problem.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="rounded-md border border-slate-800 px-2.5 py-1 text-xs text-slate-500">
                          {formatLabel(problem.difficulty)}
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-slate-300"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProblemList;
