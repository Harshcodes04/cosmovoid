import { useState } from "react";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ identifier, password });
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
                Welcome back
              </h2>
              <p className="text-sm text-white/50 mt-2">
                Continue your journey through the cosmos
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="pilot@cosmovoid.space"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-blue-500/70 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#050a1f] px-1 text-xs text-white/50">
                  Email or Username
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your star-map key"
                  className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg outline-none focus:border-blue-500/70 transition"
                  required
                />
                <span className="absolute -top-2 left-3 bg-[#050a1f] px-1 text-xs text-white/50">
                  Access Key
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-blue-700 hover:bg-blue-800 transition font-semibold tracking-wide"
              >
                Launch Session
              </button>
            </form>
            <p className="text-center text-sm text-white/50">
              New here?{" "}
              <span className="text-blue-400 hover:underline cursor-pointer">
                Create your logbook
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
