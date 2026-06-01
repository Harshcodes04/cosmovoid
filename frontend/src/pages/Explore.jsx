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
    label: "Missions",
    desc: "Live and historical spaceflight data",
    items: [
      {
        Icon: FaRocket,
        label: "Launches",
        to: "/launches",
        desc: "Track active, upcoming, and past missions",
        color: "from-cyan-500/20 to-blue-600/10",
        border: "border-cyan-400/20",
        text: "text-cyan-300",
        glow: "shadow-[0_0_24px_rgba(34,211,238,0.15)]",
      },
      {
        Icon: GiMoonOrbit,
        label: "Rockets",
        to: "/rockets",
        desc: "Full technical specs for every rocket",
        color: "from-violet-500/20 to-purple-700/10",
        border: "border-violet-400/20",
        text: "text-violet-300",
        glow: "shadow-[0_0_24px_rgba(167,139,250,0.15)]",
      },
      {
        Icon: FaUserAstronaut,
        label: "Crew",
        to: "/crew",
        desc: "Astronauts currently in orbit and beyond",
        color: "from-emerald-500/20 to-teal-700/10",
        border: "border-emerald-400/20",
        text: "text-emerald-300",
        glow: "shadow-[0_0_24px_rgba(52,211,153,0.15)]",
      },
    ],
  },
  {
    label: "Cosmos",
    desc: "Observe the universe",
    items: [
      {
        Icon: FaImages,
        label: "Gallery",
        to: "/gallery",
        desc: "NASA's archive — nebulae, galaxies, deep space",
        color: "from-pink-500/20 to-rose-700/10",
        border: "border-pink-400/20",
        text: "text-pink-300",
        glow: "shadow-[0_0_24px_rgba(244,114,182,0.15)]",
      },
      {
        Icon: GiAsteroid,
        label: "Asteroids",
        to: "/asteroids",
        desc: "Near-Earth objects and threat analysis",
        color: "from-orange-500/20 to-amber-700/10",
        border: "border-orange-400/20",
        text: "text-orange-300",
        glow: "shadow-[0_0_24px_rgba(251,146,60,0.15)]",
      },
      {
        Icon: MdEvent,
        label: "Events",
        to: "/events",
        desc: "Upcoming meteor showers, eclipses and more",
        color: "from-sky-500/20 to-indigo-700/10",
        border: "border-sky-400/20",
        text: "text-sky-300",
        glow: "shadow-[0_0_24px_rgba(56,189,248,0.15)]",
      },
    ],
  },
  {
    label: "News",
    desc: "Stay up to date",
    items: [
      {
        Icon: FaNewspaper,
        label: "News",
        to: "/news",
        desc: "Latest headlines from across the cosmos",
        color: "from-yellow-500/20 to-lime-700/10",
        border: "border-yellow-400/20",
        text: "text-yellow-300",
        glow: "shadow-[0_0_24px_rgba(250,204,21,0.15)]",
      },
    ],
  },
  {
    label: "Contact",
    desc: "Learn more & get in touch",
    items: [
      {
        Icon: FaInfoCircle,
        label: "About",
        to: "/about",
        desc: "What Cosmovoid brings together",
        color: "from-zinc-500/20 to-slate-700/10",
        border: "border-zinc-400/20",
        text: "text-zinc-300",
        glow: "shadow-[0_0_24px_rgba(161,161,170,0.1)]",
      },
      {
        Icon: FaEnvelope,
        label: "Contact",
        to: "/contact",
        desc: "Send a message to Mission Control",
        color: "from-fuchsia-500/20 to-purple-700/10",
        border: "border-fuchsia-400/20",
        text: "text-fuchsia-300",
        glow: "shadow-[0_0_24px_rgba(232,121,249,0.15)]",
      },
    ],
  },
];

const StatPill = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400">
    {icon}
    {label}
  </span>
);

const Explore = () => (
  <main className="relative min-h-screen overflow-x-hidden px-4 pb-20 pt-8 sm:px-6 md:px-10 lg:px-14 xl:px-20">
    {/* ambient glows */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-cyan-500/[0.08] blur-[100px]" />
      <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-violet-500/[0.07] blur-[100px]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/[0.05] blur-[80px]" />
    </div>

    <div className="relative mx-auto max-w-6xl space-y-14">

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0c1228]/95 via-[#080c1e]/98 to-[#060810]/98 p-6 shadow-[0_32px_64px_rgba(0,0,0,0.4)] sm:p-8 lg:p-12">
        {/* hero glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,1)]" />
              Mission directory
            </span>

            <h1 className="text-3xl font-light leading-tight tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              Explore{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text font-semibold text-transparent">
                Cosmovoid
              </span>
            </h1>

            <p className="max-w-lg text-sm leading-7 text-zinc-400">
              Your launchpad to every section of the platform — live missions,
              cosmic imagery, asteroid tracking, sky events, and more.
            </p>

            <div className="flex flex-wrap gap-2">
              <StatPill icon={<FaRocket className="size-3" />} label="Launches" />
              <StatPill icon={<TbTelescope className="size-3" />} label="Gallery" />
              <StatPill icon={<GiAsteroid className="size-3" />} label="Asteroids" />
              <StatPill icon={<BiPlanet className="size-3" />} label="Events" />
              <StatPill icon={<HiSparkles className="size-3" />} label="+ more" />
            </div>
          </div>

          {/* big decorative orbit ring */}
          <div className="hidden lg:flex size-40 shrink-0 items-center justify-center">
            <div className="relative flex size-full items-center justify-center rounded-full border border-white/[0.07]">
              <div className="absolute size-[70%] rounded-full border border-cyan-300/10" />
              <FaRocket className="size-10 text-cyan-300/30" />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-cyan-400 text-[8px] font-bold text-zinc-950">
                ✦
              </span>
            </div>
          </div>
        </div>
      </div>

      {GROUPS.map((group) => (
        <section key={group.label} className="space-y-5">
          {/* group header */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                {group.label}
              </h2>
              <p className="text-xs text-zinc-600">{group.desc}</p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          {/* cards */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 ${item.color} ${item.border} hover:${item.glow}`}
              >
                {/* card glow on hover */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40`} />
                </div>

                <div className="relative flex items-start gap-4">
                  {/* icon badge */}
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl border bg-black/20 ${item.border} ${item.text}`}>
                    <item.Icon className="size-5 transition-transform duration-300 group-hover:scale-110" aria-hidden />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-zinc-500">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* bottom row */}
                <div className="relative mt-5 flex items-center justify-between">
                  <span className={`text-[11px] font-medium tracking-wide ${item.text} transition-colors group-hover:text-white`}>
                    Open →
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${item.border} ${item.text} opacity-60`}>
                    live
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  </main>
);

export default Explore;
