import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

const sections = [
  { icon: "🚀", label: "Launches", to: "/launches", desc: "Track active and upcoming missions" },
  { icon: "🛸", label: "Rockets", to: "/rockets", desc: "Detailed specs for every rocket" },
  { icon: "👨‍🚀", label: "Crew", to: "/crew", desc: "Meet the people currently in orbit" },
  { icon: "🌌", label: "Gallery", to: "/gallery", desc: "Browse NASA's picture of the day" },
  { icon: "📡", label: "News", to: "/news", desc: "Latest space headlines" },
  { icon: "🛰️", label: "Events", to: "/events", desc: "Upcoming cosmic events feed" },
  { icon: "☄️", label: "Asteroids", to: "/asteroids", desc: "Near-Earth objects watch list" },
  { icon: "🏁", label: "Launchpads", to: "/launchpads", desc: "All active launch sites" },
];

const Explore = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="relative min-h-screen overflow-x-hidden px-6 pb-16 pt-10 md:px-10 lg:px-14 xl:px-20">
        {/* ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -right-16 top-28 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl space-y-10">
          {/* heading */}
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(12,18,40,0.96)_0%,rgba(10,12,24,0.98)_100%)] p-7 shadow-[0_26px_56px_rgba(0,0,0,0.3)] sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,1)]" />
              Navigate
            </span>
            <h1 className="mt-4 text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl">
              Explore <span className="font-semibold">Cosmovoid</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Jump to any section of the app — launches, crew, gallery, news, and more.
            </p>
          </div>

          {/* grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sections.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="group rounded-[1.6rem] border border-white/8 bg-black/20 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/5"
              >
                <span className="text-3xl">{s.icon}</span>
                <p className="mt-3 text-base font-semibold text-white">{s.label}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{s.desc}</p>
                <p className="mt-3 text-[11px] font-medium text-cyan-300 transition-colors group-hover:text-white">
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Explore;
