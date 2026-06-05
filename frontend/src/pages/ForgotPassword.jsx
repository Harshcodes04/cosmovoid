import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/space";

const STEPS = { EMAIL: "email", OTP: "otp", DONE: "done" };

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

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep]         = useState(STEPS.EMAIL);
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [newPassword, setNew]   = useState("");
  const [confirmNew, setConfirm]= useState("");
  const [error, setError]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = () => {
    setResendCooldown(30);
    const t = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  // Step 1 — send reset OTP
  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await forgotPassword(email);
      setStep(STEPS.OTP);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  // Step 2 — verify OTP + set new password
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmNew) { setError("Passwords do not match"); return; }
    if (newPassword.length < 6)    { setError("Password must be at least 6 characters"); return; }

    setBusy(true);
    try {
      await resetPassword(email, otp.trim(), newPassword);
      setStep(STEPS.DONE);
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
      await forgotPassword(email);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white flex flex-col">
      {/* ambient glows */}


      {/* top bar */}
      <div className="relative z-10 p-6">
        <Link to="/" className="inline-flex items-center gap-0.5">
          <span className="text-lg font-bold tracking-[0.24em] text-white">COSMO</span>
          <span className="text-lg font-bold tracking-[0.24em] text-cyan-300">VOID</span>
        </Link>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">

          {step === STEPS.DONE ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-green-400/30 bg-green-400/10 text-3xl">
                ✓
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">Password updated</h1>
                <p className="mt-2 text-sm text-white/45">
                  Your password has been reset successfully. You can now log in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Go to login →
              </button>
            </div>
          ) : (
            <>
              {/* step indicator */}
              <div className="mb-7 flex items-center gap-2">
                {["Enter email", "Reset password"].map((label, i) => {
                  const active = (i === 0 && step === STEPS.EMAIL) || (i === 1 && step === STEPS.OTP);
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
                  {step === STEPS.EMAIL ? "Forgot your password?" : "Set a new password"}
                </h1>
                <p className="mt-1 text-sm text-white/45">
                  {step === STEPS.EMAIL
                    ? "Enter your email and we'll send a reset code"
                    : `Enter the code sent to ${email} and choose a new password`}
                </p>
              </div>

              {/* error */}
              {error && (
                <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {step === STEPS.EMAIL && (
                <form onSubmit={handleEmail} className="space-y-4">
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="pilot@cosmovoid.space"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? "Sending code…" : "Send reset code →"}
                  </button>
                </form>
              )}

              {step === STEPS.OTP && (
                <form onSubmit={handleReset} className="space-y-4">
                  {/* OTP input */}
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

                  <Field label="New password" type="password" value={newPassword} onChange={e => setNew(e.target.value)} placeholder="Min. 6 characters" />
                  <Field label="Confirm new password" type="password" value={confirmNew} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" />

                  <button
                    type="submit"
                    disabled={busy || otp.length < 6}
                    className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? "Updating…" : "Reset password"}
                  </button>

                  {/* resend + back */}
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <button
                      type="button"
                      onClick={() => { setStep(STEPS.EMAIL); setError(""); setOtp(""); }}
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
                Remember your password?{" "}
                <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
