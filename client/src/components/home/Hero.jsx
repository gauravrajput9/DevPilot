import { ArrowRight, Code2, Flame, Play, Sparkles } from "lucide-react";
import { authClient } from "../../lib/authClient";
import { Link } from "react-router-dom";
const Hero = () => {
  const { data: session, isPending } = authClient.getSession();
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-100px] top-[10%] h-[600px] w-[600px] rounded-full border border-blue-500/[0.08]" />

      <div className="pointer-events-none absolute right-[-50px] top-[15%] h-[500px] w-[500px] rounded-full border border-violet-500/[0.08]" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-zinc-300">
              <Sparkles size={13} className="text-violet-400" />
              AI-POWERED SOFTWARE ENGINEERING PLATFORM
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[72px]">
              Learn. Code.
              <br />
              Build.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Get Hired.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              DevPilot is your all-in-one AI companion to master coding, crack
              interviews, and build real-world projects.
            </p>

            <p className="mt-2 text-base text-zinc-500">
              Personalized learning. Smarter practice. Faster growth.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-3">
              {session ? (
                <Link
                  to="/dashboard"
                  className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3.5 font-semibold shadow-xl shadow-violet-600/20 transition hover:scale-[1.02]"
                >
                  Continue Learning
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3.5 font-semibold shadow-xl shadow-violet-600/20 transition hover:scale-[1.02]"
                >
                  Start Your Journey
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              )}

              <a
                href="#features"
                className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.02] px-6 py-3.5 font-semibold text-zinc-200 transition hover:bg-white/[0.06]"
              >
                Explore Features
                <Play size={15} />
              </a>
            </div>
            {/* Social proof */}
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["A", "R", "S", "K"].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#030407] text-xs font-bold ${
                      index === 0
                        ? "bg-violet-500"
                        : index === 1
                          ? "bg-blue-500"
                          : index === 2
                            ? "bg-emerald-500"
                            : "bg-orange-500"
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <div>
                <div className="text-sm tracking-widest text-yellow-400">
                  ★★★★★
                </div>

                <p className="text-xs text-zinc-500">
                  Loved by 10,000+ developers
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <CodePreview />
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   CODE PREVIEW
========================================================= */

const CodePreview = () => {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-10 rounded-full bg-violet-600/20 blur-[100px]" />

      {/* Main Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#08090d]/95 shadow-2xl shadow-violet-900/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Code2 size={16} className="text-violet-400" />
            </div>

            <div>
              <p className="text-sm font-medium">Two Sum</p>

              <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-[10px] text-yellow-400">
                Medium
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-xs text-zinc-500 sm:flex">
            <span className="flex items-center gap-1 text-orange-400">
              <Flame size={13} />
              12
            </span>

            <span>Streak 7</span>

            <span className="text-violet-400">XP 2,450</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.07] px-4">
          {["Description", "Submissions", "Solutions", "Discuss"].map(
            (tab, index) => (
              <button
                key={tab}
                className={`px-4 py-3 text-xs ${
                  index === 0
                    ? "border-b border-violet-400 text-white"
                    : "text-zinc-500"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[1fr_230px]">
          {/* Editor */}
          <div className="min-h-[390px] border-r border-white/[0.07]">
            <div className="border-b border-white/[0.05] px-5 py-3">
              <span className="rounded-md bg-white/[0.05] px-3 py-1.5 text-xs text-zinc-400">
                JavaScript
              </span>
            </div>

            <div className="flex px-4 py-5 font-mono text-xs leading-6">
              {/* Line numbers */}
              <div className="mr-5 select-none text-right text-zinc-700">
                {Array.from({ length: 12 }, (_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>

              {/* Code */}
              <pre className="overflow-hidden text-zinc-300">
                <code>
                  <span className="text-violet-400">function</span>{" "}
                  <span className="text-blue-400">twoSum</span>
                  (nums, target) {"{"}
                  {"\n  "}
                  <span className="text-violet-400">const</span> map ={" "}
                  <span className="text-violet-400">new</span>{" "}
                  <span className="text-blue-400">Map</span>
                  ();
                  {"\n\n  "}
                  <span className="text-violet-400">for</span> (let i = 0; i
                  &lt; nums.length; i++) {"{"}
                  {"\n    "}
                  <span className="text-violet-400">const</span> complement =
                  target - nums[i];
                  {"\n\n    "}
                  <span className="text-violet-400">if</span>{" "}
                  (map.has(complement)) {"{"}
                  {"\n      "}
                  <span className="text-violet-400">return</span>{" "}
                  [map.get(complement), i];
                  {"\n    "}
                  {"}"}
                  {"\n\n    "}
                  map.set(nums[i], i);
                  {"\n  "}
                  {"}"}
                  {"\n\n  "}
                  <span className="text-violet-400">return</span> [];
                  {"\n}"}
                </code>
              </pre>
            </div>

            {/* Editor buttons */}
            <div className="flex justify-end gap-2 border-t border-white/[0.05] px-4 py-3">
              <button className="rounded-md border border-white/10 px-4 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05]">
                Run Code
              </button>

              <button className="rounded-md bg-violet-600 px-5 py-2 text-xs font-medium transition hover:bg-violet-500">
                Submit
              </button>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-white/[0.015] p-4">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={15} className="text-violet-400" />

              <span className="text-sm font-semibold">AI Assistant</span>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-xs leading-5 text-zinc-400">
                Great approach! Using a map gives you optimal O(n) time
                complexity.
              </p>

              <div className="mt-5">
                <p className="text-xs font-medium text-zinc-300">
                  Time Complexity
                </p>

                <p className="mt-1 font-mono text-xs text-violet-400">O(n)</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-zinc-300">
                  Space Complexity
                </p>

                <p className="mt-1 font-mono text-xs text-violet-400">O(n)</p>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-medium text-zinc-300">
                  Suggestions
                </p>

                {[
                  "Handle edge cases",
                  "Add input validation",
                  "Consider early return",
                ].map((item) => (
                  <div
                    key={item}
                    className="mb-2 flex items-center gap-2 text-xs text-zinc-500"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      ✓
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
