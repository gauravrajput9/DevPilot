import {
  BrainCircuit,
  Code2,
  Layers3,
  LineChart,
  Sparkles,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Interactive Coding",
    description:
      "Write, test, and practice real-world web development problems directly in your browser.",
  },
  {
    icon: Layers3,
    title: "Structured Learning",
    description:
      "Follow a clear learning path from fundamentals to advanced web development concepts.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Assistance",
    description:
      "Get intelligent hints, explanations, and guidance when you're stuck on a problem.",
  },
  {
    icon: Trophy,
    title: "Practice & Challenges",
    description:
      "Solve carefully designed problems and challenge yourself with progressively harder tasks.",
  },
  {
    icon: LineChart,
    title: "Track Your Progress",
    description:
      "Monitor solved problems, learning progress, and the skills you've developed over time.",
  },
  {
    icon: Sparkles,
    title: "Build Real Skills",
    description:
      "Practice the technologies and concepts that actually matter when building modern applications.",
  },
];

const Features = () => {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Everything you need
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Learn. Practice.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Build.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-zinc-500">
            Everything you need to turn your development knowledge into
            practical skills.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.04]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500/15">
                  <Icon size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;