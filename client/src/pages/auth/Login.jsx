import { Check, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthPage";
import { authClient } from "../../lib/authClient";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  console.log(formData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login:", formData);
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        rememberMe: formData.remember,
        password: formData.password,
        callbackURL: "/",
      });

      if (error) {
        console.log("Login Page Error: ", error);
      }

      console.log(data);
    } catch (error) {
      console.log("Login Page Handle Submit Error: ", error);
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/",
    });
  };

  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:5173/",
    });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your journey with DevPilot."
    >
      {/* Social login */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleGitHubLogin}
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
        >
          <span className="text-base font-bold">GH</span>
          GitHub
        </button>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
        >
          <span className="text-base font-bold">G</span>
          Google
        </button>
      </div>

      {/* Divider */}
      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.08]" />

        <span className="text-xs text-zinc-600">OR CONTINUE WITH EMAIL</span>

        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
            />

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-300"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs text-violet-400 transition hover:text-violet-300"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
            />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-11 pr-11 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-zinc-300"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Remember */}
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-600"
          />

          <span className="text-sm text-zinc-500">Remember me</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:scale-[1.01] hover:shadow-violet-600/30"
        >
          Sign in
        </button>
      </form>

      {/* Signup */}
      <p className="mt-7 text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-violet-400 hover:text-violet-300"
        >
          Create account
        </Link>
      </p>

      {/* Terms */}
      <p className="mt-6 text-center text-[11px] leading-5 text-zinc-700">
        By continuing, you agree to DevPilot's{" "}
        <a href="#" className="text-zinc-500 hover:text-zinc-300">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-zinc-500 hover:text-zinc-300">
          Privacy Policy
        </a>
        .
      </p>
    </AuthLayout>
  );
};

export default Login;
