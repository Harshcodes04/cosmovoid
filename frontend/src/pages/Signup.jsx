import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { sendOtp, verifyOtp } from "../api/space";

// steps: "details" → "otp" → "done"
const STEPS = { DETAILS: "details", OTP: "otp" };

const Field = ({ label, type = "text", value, onChange, placeholder, autoFocus }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      required
      className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 placeholder:text-white/25"
    />
    <span className="absolute -top-2.5 left-3 bg-[#0d0d0d] px-1 text-[11px] text-white/45">
      {label}
    </span>
  </div>
);

const Signup = () => {
  const { user, signup } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]         = useState(STEPS.DETAILS);
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [otp, setOtp]           = useState("");
  const [error, setError]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  if (user) return <Navigate to="/dashboard" replace />;

  const startCooldown = () => {
    setResendCooldown(30);
    const t = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  // Step 1 — validate details & send OTP
  const handleDetails = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }

    setBusy(true);
    try {
      await sendOtp(email, username);
      setStep(STEPS.OTP);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setBusy(false);
    }
  };

  // Step 2 — verify OTP then create account
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyOtp(email, otp.trim());
      // OTP valid — now create the account
      await signup(username, email, password, confirm);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Check your code.");
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setBusy(true);
    try {
      await sendOtp(email, username);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setBusy(false);
    }
  };

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
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">

          {/* step indicator */}
          <div className="mb-7 flex items-center gap-2">
            {["Account details", "Verify email"].map((label, i) => {
              const active = (i === 0 && step === STEPS.DETAILS) || (i === 1 && step === STEPS.OTP);
              const done   = i === 0 && step === STEPS.OTP;
              return (
                <div key={label} className="flex items-center gap-2">
                  {i > 0 && <div className="h-px w-6 bg-white/15" />}
                  <div className="flex items-center gap-1.5">
                    <span className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                      done   ? "bg-cyan-400 text-zinc-950" :
                      active ? "border border-cyan-400 text-cyan-300" :
                               "border border-white/15 text-white/30"
                    }`}>
                      {done ? "✓" : i + 1}
                    </span>
                    <span className={`text-xs transition-colors ${active ? "text-white" : "text-white/35"}`}>
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">
              {step === STEPS.DETAILS ? "Create your account" : "Check your inbox"}
            </h1>
            <p className="mt-1 text-sm text-white/45">
              {step === STEPS.DETAILS
                ? "Begin your journey through the cosmos"
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {step === STEPS.DETAILS && (
            <form onSubmit={handleDetails} className="space-y-4">
              <Field label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="cosmic_traveler" autoFocus />
              <Field label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="pilot@cosmovoid.space" />
              <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />
              <Field label="Confirm password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" />
              <button
                type="submit"
                disabled={busy}
                className="mt-1 w-full rounded-lg bg-white py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Sending code…" : "Continue →"}
              </button>
            </form>
          )}

          {step === STEPS.OTP && (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* large OTP input */}
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="______"
                  autoFocus
                  required
                  className="w-full rounded-lg border border-white/10 bg-transparent px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-cyan-300 outline-none transition focus:border-cyan-400/60 placeholder:text-white/15 placeholder:tracking-[0.5em]"
                />
                <span className="absolute -top-2.5 left-3 bg-[#0d0d0d] px-1 text-[11px] text-white/45">
                  6-digit code
                </span>
              </div>

              <button
                type="submit"
                disabled={busy || otp.length < 6}
                className="w-full rounded-lg bg-cyan-400 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Verifying…" : "Verify & create account"}
              </button>

              {/* resend + back */}
              <div className="flex items-center justify-between text-xs text-white/40">
                <button
                  type="button"
                  onClick={() => { setStep(STEPS.DETAILS); setError(""); setOtp(""); }}
                  className="hover:text-white transition-colors"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || busy}
                  className="hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
