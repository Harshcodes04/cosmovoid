import { Link } from "react-router-dom";

const year = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
}).format(new Date());

const NAV = [
  {
    heading: "Explore",
    links: [
      { label: "Home",     to: "/" },
      { label: "Launches", to: "/launches" },
      { label: "Rockets",  to: "/rockets" },
      { label: "Crew",     to: "/crew" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "Gallery",   to: "/gallery" },
      { label: "Events",    to: "/events" },
      { label: "Asteroids", to: "/asteroids" },
      { label: "News",      to: "/news" },
    ],
  },
  {
    heading: "Personal",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Journal",   to: "/journal" },
      { label: "New entry", to: "/journal/new" },
      { label: "Explore",   to: "/explore" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Terms & Privacy", to: "/terms" },
      { label: "GitHub",  href: "https://github.com/Harshcodes04/cosmovoid", external: true },
    ],
  },
];

const DATA_SOURCES = [
  "SpaceX API", "NASA APOD", "NASA NeoWs",
  "NASA Images", "Launch Library 2", "Spaceflight News API",
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/[0.06]">
    <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#080808] to-[#050505]" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
    <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[100px]" />
    <div className="pointer-events-none absolute -right-24 top-8 h-96 w-96 rounded-full bg-violet-500/[0.04] blur-[120px]" />
    <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-zinc-600/[0.06] blur-[80px]" />

    <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-14 md:px-10 md:pt-16 xl:px-20">

      {/* Mobile: single col (brand then 2×2 nav grid)       */}
      {/* LG+:   brand | 4-col nav side by side              */}
      <div className="grid gap-10 lg:grid-cols-[1.6fr_2fr]">

        {/* brand */}
        <div className="flex flex-col gap-5">
          <Link to="/" className="group inline-block w-fit">
            <span className="text-xl font-bold tracking-[0.3em] text-white transition-opacity group-hover:opacity-80 sm:text-2xl">
              COSMO
            </span>
            <span className="text-xl font-bold tracking-[0.3em] text-cyan-300 transition-opacity group-hover:opacity-80 sm:text-2xl">
              VOID
            </span>
          </Link>

          <p className="max-w-[260px] text-sm leading-7 text-zinc-500">
            Your private observatory for launches, NASA imagery, cosmic events,
            and personal mission logs — all in one orbit.
          </p>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-cyan-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
            </span>
            Systems online
          </span>

          <a
            href="https://github.com/Harshcodes04/cosmovoid"
            target="_blank"
            rel="noreferrer"
            aria-label="View on GitHub"
            className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-zinc-400 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
            Harshcodes04 / cosmovoid
          </a>
        </div>

        {/* nav columns — 2×2 on mobile, 4-col on sm+ */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {NAV.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-600">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer"
                        className="text-sm text-zinc-500 transition-colors hover:text-white">
                        {l.label} ↗
                      </a>
                    ) : (
                      <Link to={l.to}
                        className="text-sm text-zinc-500 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 sm:mt-12 sm:px-6 sm:py-5">
        <p className="mb-3 text-[9px] uppercase tracking-[0.32em] text-zinc-700">
          Powered by open data from
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {DATA_SOURCES.map((src) => (
            <span key={src}
              className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-600 sm:px-3">
              {src}
            </span>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent sm:my-8" />

      {/* Mobile: centred column; sm+: space-between row     */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="space-y-1">
          <p className="text-[11px] text-zinc-700">
            © {year} Cosmovoid · All rights reserved.
          </p>
          <p className="text-[11px] text-zinc-700">
            Built with <span className="text-zinc-500">♥</span> for space explorers · Data refreshed every 24 h
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] tracking-wide text-zinc-500 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
            <path d="M8 12V4M4 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to top
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
