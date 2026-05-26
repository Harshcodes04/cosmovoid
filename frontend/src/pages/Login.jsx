import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(identifier, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to log in right now. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white flex flex-col">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/[0.05] blur-[100px]" />

      {/* top bar */}
      <div className="relative z-10 p-6">
        <Link to="/" className="inline-flex items-center gap-0.5">
          <span className="text-lg font-bold tracking-[0.24em] text-white">COSMO</span>
          <span className="text-lg font-bold tracking-[0.24em] text-cyan-300">VOID</span>
        </Link>
      </div>

      {/* card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-white">
                Welcome back
              </h2>
              <p className="text-sm text-white/50 mt-2">
                Continue your journey through the cosmos
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="pilot@cosmovoid.space"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-cyan-400/60 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#0a0a0a] px-1 text-xs text-white/50">
                  Email or Username
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your star-map key"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-cyan-400/60 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#0a0a0a] px-1 text-xs text-white/50">
                  Access Key
                </span>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-white/40 hover:text-cyan-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-white text-zinc-950 hover:bg-zinc-100 transition font-semibold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? "Launching..." : "Launch Session"}
              </button>
            </form>
            <p className="text-center text-sm text-white/50">
              New here?{" "}
              <Link to="/signup" className="text-cyan-400 hover:underline">
                Create your logbook
              </Link>
            </p>
        </div>
      </div>
    </main>
  );
};

export default Login;

//useLocation is used to get the previous page the user was on before being redirected to login. After successful login, we can redirect them back to that page instead of always going to a default dashboard.
