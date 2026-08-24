import { ArrowRight, Bot, Menu, Moon, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../../lib/authClient";
import { useEffect } from "react";
import { useRef } from "react";

const navItems = [
  "Home",
  "Problems",
  "AI Mentor",
  "Interview",
  "Roadmap",
  "Leaderboard",
];

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { data: session } = authClient.useSession();
  const searchRef = useRef(null);

  // console.log(session?.user);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();

        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#030407]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-lg shadow-violet-500/20">
            <Bot size={21} />

            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-[#030407] bg-emerald-400" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Dev
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Pilot
            </span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`rounded-lg px-3.5 py-2 text-sm transition-all ${
                index === 0
                  ? "bg-white/[0.06] text-white"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-3 lg:flex">
          <SearchBar />
          {/* Theme */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white">
            <Moon size={17} />
          </button>

          {!session ? (
            <Link
              to="/signup"
              className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <button
              onClick={() => authClient.signOut()}
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 lg:hidden"
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <div className="border-t border-white/[0.07] bg-[#050609] px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setMobileMenu(false)}
                className="rounded-lg px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          {!session ? (
            <Link
              to="/signup"
              className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <button
              onClick={() => authClient.signOut()}
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

const SearchBar = () => {
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-10 w-[205px] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-500 transition focus-within:border-white/20 focus-within:text-zinc-300">
      <Search size={16} className="shrink-0" />

      <input
        ref={searchRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search anything..."
        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
      />

      {!search && (
        <kbd className="ml-auto shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px]">
          ⌘K
        </kbd>
      )}
    </div>
  );
};

export default Navbar;
