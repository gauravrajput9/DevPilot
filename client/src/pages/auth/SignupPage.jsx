import { Check, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { authClient } from "../../lib/authClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthPage";
const Signup = () => {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Signup failed:", error);
        return;
      }

      console.log("Signup successful:", data);

      navigate("/")
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const passwordRules = [
    {
      label: "8+ characters",
      valid: formData.password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(formData.password),
    },
  ];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your journey to becoming a better developer."
    >
      {/* Social signup */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
        >
          <span className="text-base font-bold">GH</span>
          GitHub
        </button>

        <button
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

        <span className="text-xs text-zinc-600">OR SIGN UP WITH EMAIL</span>

        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Full name
          </label>

          <div className="relative">
            <User
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
            />

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Gaurav Rajput"
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
        </div>

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
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Password
          </label>

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
              placeholder="Create a strong password"
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

          {/* Password rules */}
          <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {passwordRules.map((rule) => (
              <div
                key={rule.label}
                className={`flex items-center gap-1.5 text-[10px] ${
                  rule.valid ? "text-emerald-400" : "text-zinc-600"
                }`}
              >
                <Check size={12} />
                {rule.label}
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            required
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-600"
          />

          <span className="text-xs leading-5 text-zinc-500">
            I agree to the{" "}
            <a href="#" className="text-violet-400 hover:text-violet-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-violet-400 hover:text-violet-300">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:scale-[1.01] hover:shadow-violet-600/30"
        >
          Create account
        </button>
      </form>

      {/* Login */}
      <p className="mt-7 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-violet-400 hover:text-violet-300"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
