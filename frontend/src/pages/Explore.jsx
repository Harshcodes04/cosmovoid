import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaImages,
  FaInfoCircle,
  FaNewspaper,
  FaRocket,
  FaUserAstronaut,
} from "react-icons/fa";
import { GiAsteroid, GiMoonOrbit } from "react-icons/gi";
import { MdEvent } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { BiPlanet } from "react-icons/bi";
import { TbTelescope } from "react-icons/tb";

const GROUPS = [
  {
    label: "Missions & Hardware",
    desc: "Live launch telemetry and orbital vehicle specifications.",
    items: [
      {
        Icon: FaRocket,
        label: "Launches",
        to: "/launches",
        desc: "Track active, upcoming, and past missions",
      },
      {
        Icon: GiMoonOrbit,
        label: "Rockets",
        to: "/rockets",
        desc: "Full technical specs for every rocket",
      },
      {
        Icon: FaUserAstronaut,
        label: "Crew",
        to: "/crew",
        desc: "Astronauts currently in orbit and beyond",
      },
    ],
  },
  {
    label: "Cosmic Observation",
    desc: "Observe the universe, track objects, and monitor sky events.",
    items: [
      {
        Icon: FaImages,
        label: "Gallery",
        to: "/gallery",
        desc: "NASA's archive — nebulae, galaxies, deep space",
      },
      {
        Icon: GiAsteroid,
        label: "Asteroids",
        to: "/asteroids",
        desc: "Near-Earth objects and threat analysis",
      },
      {
        Icon: MdEvent,
        label: "Events",
        to: "/events",
        desc: "Upcoming meteor showers, eclipses and more",
      },
    ],
  },
  {
    label: "Intelligence & Comm",
    desc: "Stay up to date and communicate with mission control.",
    items: [
      {
        Icon: FaNewspaper,
        label: "News",
        to: "/news",
        desc: "Latest headlines from across the cosmos",
      },
      {
        Icon: FaInfoCircle,
        label: "About",
        to: "/about",
        desc: "What Cosmovoid brings together",
      },
      {
        Icon: FaEnvelope,
        label: "Contact",
        to: "/contact",
        desc: "Send a message to Mission Control",
      },
    ],
  },
];

const StatPill = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-transparent px-3 py-1.5 text-xs text-zinc-400">
    {icon}
    {label}
  </span>
);

const Explore = () => (
  <main className="relative min-h-screen overflow-hidden px-5 pb-20 pt-10 md:px-10 lg:px-14 xl:px-20">
    <div className="mx-auto max-w-6xl space-y-16">
      {/* Hero Section */}
      <div className="relative border-b border-white/10 pb-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3"></div>

            <h1 className="text-4xl font-light leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore{" "}
              <span className="font-medium text-cyan-400">Cosmovoid</span>
            </h1>

            <p className="max-w-xl text-sm leading-7 text-zinc-400">
              Your launchpad to every section of the platform — live missions,
              cosmic imagery, asteroid tracking, sky events, and more.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <StatPill
                icon={<FaRocket className="size-3" />}
                label="Launches"
              />
              <StatPill
                icon={<TbTelescope className="size-3" />}
                label="Gallery"
              />
              <StatPill
                icon={<GiAsteroid className="size-3" />}
                label="Asteroids"
              />
              <StatPill icon={<BiPlanet className="size-3" />} label="Events" />
              <StatPill
                icon={<HiSparkles className="size-3" />}
                label="+ more"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Directory Sections */}
      <div className="space-y-16">
        {GROUPS.map((group) => (
          <section key={group.label} className="space-y-6">
            {/* Group Header */}
            <div>
              <h2 className="text-xl font-medium text-white">{group.label}</h2>
              <p className="mt-1 text-sm text-zinc-500">{group.desc}</p>
            </div>

            {/* Simple Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex flex-col justify-between border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-cyan-400/30 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center bg-black/40 text-zinc-400 transition-colors duration-300 group-hover:text-cyan-400">
                      <item.Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-base font-medium text-white transition-colors duration-300 group-hover:text-cyan-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 transition-colors duration-300 group-hover:text-cyan-400">
                      Enter →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  </main>
);

export default Explore;
