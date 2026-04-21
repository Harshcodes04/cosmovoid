import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/useAuth";

const featureChips = [
  {
    title: "Mission Briefs",
    accent: "from-sky-300/80 via-cyan-200/60 to-white/20",
  },
  {
    title: "Launch Intel",
    accent: "from-zinc-200/80 via-zinc-400/40 to-white/10",
  },
  {
    title: "Journal Logs",
    accent: "from-fuchsia-300/70 via-violet-300/45 to-white/10",
  },
];

const snapshotPanels = [
  {
    title: "Aurora Watch",
    copy: "Live sky moods above Earth",
    className:
      "min-h-[210px] bg-[radial-gradient(circle_at_top,#84ffe0_0%,rgba(62,176,255,0.2)_38%,rgba(8,10,24,0.96)_100%)]",
  },
  {
    title: "Moon Atlas",
    copy: "Surface stories and orbit data",
    className:
      "min-h-[210px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.58),transparent_22%),linear-gradient(180deg,#0d1632_0%,#15264a_44%,#0a0f22_100%)]",
  },
  {
    title: "Orbital Deck",
    copy: "Track capsules, crews, and routes",
    className:
      "min-h-[150px] bg-[linear-gradient(135deg,#19325b_0%,#0d132b_52%,#04050d_100%)]",
  },
  {
    title: "Deep Field",
    copy: "A cinematic archive of distant light",
    className:
      "min-h-[260px] bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.22),transparent_10%),radial-gradient(circle_at_20%_30%,rgba(136,183,255,0.26),transparent_18%),linear-gradient(180deg,#060816_0%,#0d1632_100%)]",
  },
  {
    title: "Flight Window",
    copy: "See what is lifting off next",
    className:
      "min-h-[180px] bg-[linear-gradient(160deg,#7690c9_0%,#1e315f_40%,#08101f_100%)]",
  },
];

const Home = () => {
  const { user } = useAuth();

  const loggedIn = user
    ? { to: "/dashboard", label: "Open dashboard" }
    : { to: "/signup", label: "Start exploring" };

  const guest = user
    ? { to: "/explore", label: "Browse routes" }
    : { to: "/login", label: "Sign in" };

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-12 h-72 w-72 rounded-full bg-sky-500/18 blur-3xl" />
          <div className="absolute right-[-6%] top-28 h-80 w-80 rounded-full bg-violet-400/16 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        </div>

        <section className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 md:px-10 lg:grid-cols-[minmax(0,1.2fr)_420px] lg:px-16 xl:px-20">
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
                Cosmovoid Mission Control
              </p>

              <div className="max-w-4xl space-y-5">
                <h1 className="text-5xl font-light leading-none tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-[7.6rem]">
                  Your gateway
                  <br />
                  to the stars
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                  Explore launches, cosmic photography, near-Earth alerts, and
                  your own journal logs from a home page designed to feel like a
                  private observatory.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {featureChips.map((chip) => (
                  <div
                    key={chip.title}
                    className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <span
                      className={`h-9 w-9 rounded-full bg-gradient-to-br ${chip.accent} ring-1 ring-white/10`}
                    />
                    <span>{chip.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_220px]">
              <div className="relative min-h-[500px]">
                <div className="absolute left-3 top-16 h-[76%] w-[76%] rounded-[2.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(93,144,255,0.32)_0%,rgba(10,14,30,0.96)_78%)] shadow-[0_32px_60px_rgba(0,0,0,0.38)] -rotate-[8deg]" />
                <div className="absolute bottom-8 right-2 h-[72%] w-[64%] rounded-[2.25rem] border border-white/8 bg-[linear-gradient(180deg,rgba(126,196,255,0.24)_0%,rgba(18,29,62,0.96)_72%)] shadow-[0_28px_56px_rgba(0,0,0,0.34)] rotate-[7deg]" />

                <article className="relative z-10 flex min-h-[500px] flex-col justify-between overflow-hidden rounded-[2.75rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_24%),linear-gradient(180deg,rgba(93,148,218,0.35)_0%,rgba(23,35,71,0.92)_42%,rgba(8,12,24,0.98)_100%)] p-6 shadow-[0_36px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-8 top-12 h-32 w-32 rounded-full border border-white/10 bg-white/8 blur-xl" />
                    <div className="absolute right-10 top-20 h-40 w-40 rounded-full bg-sky-200/12 blur-2xl" />
                    <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-100/10 blur-3xl" />
                    <div className="absolute inset-x-12 bottom-20 h-px bg-white/20" />
                  </div>

                  <div className="relative space-y-3">
                    <p className="text-sm text-zinc-200/90">
                      Daily Cosmic Briefing
                    </p>
                    <div className="space-y-2">
                      <h2 className="max-w-md text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl">
                        Step inside the orbit of discoveries happening now.
                      </h2>
                      <p className="max-w-lg text-sm leading-6 text-zinc-300 sm:text-base">
                        A cinematic entry point for NASA imagery, mission
                        updates, asteroid watchlists, and your personal notes.
                      </p>
                    </div>
                  </div>

                  <div className="relative space-y-5">
                    <div className="grid gap-3 text-sm text-zinc-200 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                          Today
                        </p>
                        <p className="mt-2 font-medium">APOD spotlight</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                          Live
                        </p>
                        <p className="mt-2 font-medium">Launch pulse</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                          Personal
                        </p>
                        <p className="mt-2 font-medium">Journal vault</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        to={loggedIn.to}
                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
                      >
                        {loggedIn.label}
                      </Link>
                      <Link
                        to={guest.to}
                        className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 backdrop-blur-sm transition-colors hover:bg-white/10"
                      >
                        {guest.label}
                      </Link>
                    </div>
                  </div>
                </article>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_48px_rgba(0,0,0,0.26)] backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                    Core systems
                  </p>
                  <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-white">
                    Discover
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Navigate launches, rockets, crew profiles, and far-reaching
                    astronomy events in one place.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(125,211,252,0.16)_0%,rgba(10,14,28,0.92)_100%)] p-5 shadow-[0_24px_48px_rgba(0,0,0,0.26)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                    Personal orbit
                  </p>
                  <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-white">
                    Capture
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Save thoughts, mission highlights, and visual references to
                    build your own trail through the cosmos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {snapshotPanels.slice(0, 3).map((panel) => (
                  <article
                    key={panel.title}
                    className={`relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.28)] ${panel.className}`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-70">
                      <div className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-white/80" />
                      <div className="absolute right-6 top-10 h-1 w-1 rounded-full bg-white/50" />
                      <div className="absolute left-1/2 top-1/3 h-1 w-1 rounded-full bg-white/60" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                      <p className="text-sm font-medium text-white">
                        {panel.title}
                      </p>
                      <p className="mt-1 max-w-[11rem] text-xs leading-5 text-zinc-300">
                        {panel.copy}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="space-y-4 pt-6">
                {snapshotPanels.slice(3).map((panel) => (
                  <article
                    key={panel.title}
                    className={`relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.28)] ${panel.className}`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-70">
                      <div className="absolute left-5 top-5 h-1.5 w-1.5 rounded-full bg-white/80" />
                      <div className="absolute right-4 top-14 h-1 w-1 rounded-full bg-white/50" />
                      <div className="absolute left-1/3 top-1/2 h-1 w-1 rounded-full bg-white/60" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                      <p className="text-sm font-medium text-white">
                        {panel.title}
                      </p>
                      <p className="mt-1 max-w-[11rem] text-xs leading-5 text-zinc-300">
                        {panel.copy}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <article className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,#171b37_0%,#101428_100%)] px-6 py-8 shadow-[0_30px_60px_rgba(0,0,0,0.34)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.22),transparent_65%)]" />
              <div className="relative space-y-4 text-center">
                <h2 className="text-3xl font-medium leading-tight tracking-[-0.05em] text-white">
                  Welcome to
                  <br />
                  Cosmovoid
                </h2>
                <p className="mx-auto max-w-xs text-sm leading-6 text-zinc-300">
                  Start with today&apos;s sky, dive into active missions, and
                  keep your own record of what pulled you deeper into space.
                </p>
                <Link
                  to={loggedIn.to}
                  className="mx-auto inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {loggedIn.label}
                </Link>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </>
  );
};

export default Home;
