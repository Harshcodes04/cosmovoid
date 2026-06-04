import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaGlobeAsia,
  FaRegCompass,
  FaSatellite,
} from "react-icons/fa";
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
    <main className="min-h-screen px-6 pt-6 pb-16 md:px-12 lg:px-20 max-w-5xl mx-auto selection:bg-zinc-800 selection:text-white">
      {/* Narrative Hero */}
      <section className="max-w-2xl mt-4 mb-12">
        <p className="text-blue-500 font-medium mb-4">About Cosmovoid</p>
        <h1 className="text-4xl sm:text-5xl text-white font-bold tracking-tight mb-8">
          A quiet place to watch the universe.
        </h1>
        <div className="text-zinc-400 space-y-5 text-sm sm:text-base leading-relaxed">
          <p>
            Space data is usually scattered across a dozen clunky agency
            websites, loud news feeds, and noisy social media timelines. I
            wanted something different—a grounded space for discovery.
          </p>
          <p>
            Cosmovoid is built as a personal observatory. It pulls raw
            telemetry, high-definition NASA imagery, and active launch schedules
            into a single, distraction-free environment. But more importantly,
            it gives you a place to keep your own logs.
          </p>
        </div>
        <div className="flex gap-6 mt-12"></div>
      </section>

      {/* Structural Info */}
      <section className="border-t border-zinc-800/60 pt-10 pb-12 grid md:grid-cols-[1fr_minmax(250px,300px)] gap-12 md:gap-16 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Built for return trips
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            The architecture intentionally places public discovery and private
            reflection side by side. A launch detail, a beautiful APOD image, or
            a news headline isn't just something you consume—it becomes a
            permanent part of your own mission log.
          </p>
        </div>

        <ul className="space-y-4 text-sm w-full">
          {stats.map(([label, value]) => (
            <li
              key={label}
              className="flex justify-between items-end border-b border-zinc-800/40 pb-3"
            >
              <span className="text-zinc-500 pr-4 font-medium">{label}</span>
              <span className="text-white text-right font-medium">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Capabilities */}
      <section className="border-t border-zinc-800/60 pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          Core Capabilities
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="group">
              <div className="text-blue-500 mb-5 transition-colors group-hover:text-blue-400">
                <pillar.Icon className="size-6" />
              </div>
              <p className="text-blue-500 font-medium text-xs mb-3">
                {pillar.label}
              </p>
              <h3 className="text-white text-lg font-bold mb-3">
                {pillar.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {pillar.copy}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
