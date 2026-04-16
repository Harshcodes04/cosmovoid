import { useState } from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    console.log({ username, email, password });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#050a1f] to-[#000814] text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl tracking-widest font-semibold text-white/90">
          Cosmovoid
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(30,64,175,0.15)] backdrop-blur-md">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-white">
                Create your logbook
              </h2>
              <p className="text-sm text-white/50 mt-2">
                Begin your journey through the cosmos
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="cosmic_traveler"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-blue-500/70 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#050a1f] px-1 text-xs text-white/50">
                  Username
                </span>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilot@cosmovoid.space"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-blue-500/70 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#050a1f] px-1 text-xs text-white/50">
                  Signal ID (Email)
                </span>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create your star-map key"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-blue-500/70 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#050a1f] px-1 text-xs text-white/50">
                  Access Key
                </span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm your key"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-blue-500/70 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#050a1f] px-1 text-xs text-white/50">
                  Confirm Key
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-800 transition font-semibold tracking-wide"
              >
                Launch Account
              </button>
            </form>
            <p className="text-center text-sm text-white/50">
              Already have an account?{" "}
              <span className="text-blue-400 hover:underline cursor-pointer">
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
