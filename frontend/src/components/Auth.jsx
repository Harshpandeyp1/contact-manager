import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../Service/authContext.js";
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Users, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2
} from "lucide-react";

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") !== "register";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const switchMode = (mode) => {
    setSearchParams({ mode });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email.trim(), formData.password);
      } else {
        if (!formData.name.trim()) {
          throw new Error("Please enter your name");
        }
        await register(formData.name.trim(), formData.email.trim(), formData.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Authentication failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 selection:bg-emerald-500 selection:text-neutral-950">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold group-hover:scale-105 transition">
          <Users size={19} />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-100">
          Nexus<span className="text-emerald-400">Contacts</span>
        </span>
      </Link>

      <div className="w-full max-w-[420px] bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl rounded-2xl p-7 sm:p-8 shadow-2xl relative z-10">
        {/* Toggle Pills */}
        <div className="grid grid-cols-2 p-1 bg-neutral-950/80 border border-neutral-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              isLogin
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              !isLogin
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Register
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-neutral-100">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {isLogin
              ? "Sign in to manage and query your contacts"
              : "Get started with your private contact directory"}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Harsh Pandey"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-neutral-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-neutral-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-neutral-500 hover:text-neutral-300 transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : isLogin ? (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(isLogin ? "register" : "login")}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition ml-1"
          >
            {isLogin ? "Register now" : "Sign in here"}
          </button>
        </p>
      </div>
    </div>
  );
}