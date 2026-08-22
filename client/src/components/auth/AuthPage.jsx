import { ArrowLeft, Bot, Sparkles } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#030407] text-white">

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-150px] top-[-150px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute bottom-[-150px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/5 blur-[120px]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 py-5 lg:px-10">

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-lg shadow-violet-500/20">
            <Bot size={21} />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Dev
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Pilot
            </span>
          </span>
        </a>

        <a
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to home
        </a>
      </div>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-center px-5 pb-10 pt-5">
        <div className="grid w-full max-w-[1100px] overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/40 lg:grid-cols-2">

          {/* Left visual section */}
          <div className="relative hidden overflow-hidden border-r border-white/[0.07] bg-gradient-to-br from-violet-600/[0.08] via-transparent to-blue-600/[0.06] p-12 lg:flex lg:flex-col lg:justify-between">

            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <Sparkles
                  size={21}
                  className="text-violet-400"
                />
              </div>

              <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight tracking-tight">
                Build your skills.
                <br />

                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Accelerate your career.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-zinc-500">
                Learn, practice, and prepare for your next
                software engineering opportunity with your
                AI-powered development companion.
              </p>
            </div>

            {/* Decorative code card */}
            <div className="mt-12 rounded-2xl border border-white/[0.08] bg-[#050609]/80 p-5 font-mono text-xs shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              </div>

              <p className="text-zinc-600">
                01
              </p>

              <p className="text-violet-400">
                const{" "}
                <span className="text-blue-400">
                  developer
                </span>{" "}
                = {"{"}
              </p>

              <p className="pl-5 text-zinc-400">
                skills:{" "}
                <span className="text-emerald-400">
                  "unlimited"
                </span>
                ,
              </p>

              <p className="pl-5 text-zinc-400">
                mindset:{" "}
                <span className="text-emerald-400">
                  "growth"
                </span>
                ,
              </p>

              <p className="pl-5 text-zinc-400">
                mentor:{" "}
                <span className="text-emerald-400">
                  "AI"
                </span>
              </p>

              <p className="text-violet-400">
                {"}"};
              </p>

              <p className="mt-4 text-zinc-600">
                07
              </p>

              <p className="text-violet-400">
                developer.
                <span className="text-blue-400">
                  build
                </span>
                ();
              </p>
            </div>
          </div>

          {/* Form section */}
          <div className="p-6 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                  {title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {subtitle}
                </p>
              </div>

              {children}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;