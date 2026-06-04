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


        <section className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="py-7 sm:py-9">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-zinc-200">
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
              className="inline-flex items-center justify-center bg-white px-6 py-3 text-sm font-semibold text-zinc-950"
            >
              Explore sections
            </Link>
            <Link
              to="/journal"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-100"
            >
              Open journal
            </Link>
          </div>
        </div>

        <aside className="p-6">
          <div className="flex size-14 items-center justify-center text-zinc-200">
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
                className="px-4 py-3"
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
            className="p-5"
          >
            <span className="flex size-12 items-center justify-center text-zinc-200">
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
