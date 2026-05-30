import { Link } from "react-router-dom";
import { FaBookOpen, FaGlobeAsia, FaRegCompass, FaSatellite } from "react-icons/fa";
import Navbar from "../components/NavBar";

const pillars = [
  {
    Icon: FaSatellite,
    label: "Live Telemetry",
    title: "Real-time mission tracking",
    copy: "Monitor active rocket launches, track global spaceflight schedules, and browse detailed astronaut manifests as they happen.",
  },
  {
    Icon: FaGlobeAsia,
    label: "Cosmic Context",
    title: "The universe, unfiltered",
    copy: "Access high-fidelity NASA galleries, live Near-Earth Object (NEO) threat assessments, and the absolute latest in space headlines.",
  },
  {
    Icon: FaBookOpen,
    label: "Command Deck",
    title: "Your private mission log",
    copy: "Save mission details, favorite NASA photography, and document your own stargazing observations in your encrypted personal journal.",
  },
];

const stats = [
  ["Feeds", "NASA, SpaceX, News"],
  ["Mode", "Public + private"],
  ["Focus", "Discovery"],
];

const About = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-6 pb-16 pt-10 md:px-10 lg:px-14 xl:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-[-10%] top-8 h-96 w-96 rounded-full bg-zinc-600/8 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-emerald-300/7 blur-3xl" />
        </div>

        <section className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(13,22,48,0.96)_0%,rgba(8,10,22,0.98)_100%)] p-7 shadow-[0_26px_56px_rgba(0,0,0,0.3)] sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
              About Cosmovoid
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            A state-of-the-art observatory for the modern space explorer.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Cosmovoid integrates live SpaceX and global launch telemetry, high-definition NASA media feeds, real-time asteroid tracking, and your own private journaling system into one uncompromising, distraction-free interface.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore sections
            </Link>
            <Link
              to="/journal"
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
            >
              Open journal
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-black/24 p-6 shadow-[0_24px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-zinc-200">
            <FaRegCompass className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-medium tracking-[-0.04em] text-white">
            Built for return trips
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            The app keeps public discovery and personal reflection close
            together, so a launch detail, image, or headline can become part of
            your own mission log.
          </p>
          <div className="mt-6 grid gap-3">
            {stats.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="relative mx-auto mt-8 grid max-w-7xl gap-4 md:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[1.6rem] border border-white/8 bg-black/20 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-zinc-200">
              <pillar.Icon className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-zinc-500">
              {pillar.label}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              {pillar.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{pillar.copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default About;
