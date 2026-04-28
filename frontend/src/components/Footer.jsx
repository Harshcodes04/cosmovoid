import { Link } from "react-router-dom";

const year = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
}).format(new Date());

const cols = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Launches", to: "/launches" },
      { label: "Rockets", to: "/rockets" },
      { label: "Crew", to: "/crew" },
      { label: "Roadster", to: "/roadster" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "Gallery", to: "/gallery" },
      { label: "News", to: "/news" },
      { label: "Events", to: "/events" },
      { label: "Asteroids", to: "/asteroids" },
      { label: "Launchpads", to: "/launchpads" },
    ],
  },
  {
    heading: "Personal",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Journal", to: "/journal" },
      { label: "New entry", to: "/journal/new" },
      { label: "Search", to: "/search" },
      { label: "Explore", to: "/explore" },
    ],
  },
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/7 bg-gradient-to-b from-transparent to-[#06040e]/98 backdrop-blur-md">
    {/* top shimmer line */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />

    {/* ambient glows */}
    <div className="cosmos-star pointer-events-none absolute -bottom-10 left-[10%] h-48 w-72 rounded-full bg-cyan-400/4 blur-3xl" />
    <div className="cosmos-star pointer-events-none absolute -bottom-5 right-[15%] h-44 w-64 rounded-full bg-violet-400/5 blur-3xl [animation-delay:3s]" />

    <div className="mx-auto max-w-7xl px-6 pb-8 pt-14 md:px-10 xl:px-20">
      {/* top grid: brand + columns */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        {/* brand */}
        <div className="max-w-xs">
          <Link
            to="/"
            className="mb-4 inline-block text-lg font-bold tracking-[0.24em] text-zinc-50 no-underline"
          >
            COSMOVOID
          </Link>
          <p className="mb-5 text-sm leading-7 text-zinc-500">
            Your private observatory for launches, NASA imagery, cosmic events,
            and personal journal logs — all in one orbit.
          </p>
          {/* live status chip */}
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/6 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-cyan-300">
            <span className="cosmos-star h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
            Systems online
          </span>
        </div>

        {/* nav columns */}
        {cols.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
              {col.heading}
            </p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* divider */}
      <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/7 to-transparent" />

      {/* bottom bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] tracking-wide text-zinc-700">
          © {year} Cosmovoid &middot; Data from SpaceX API, NASA APOD &amp;
          Spaceflight News API &middot;{" "}
          <span className="text-zinc-600">Built with ♥ for space explorers</span>
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] tracking-wide text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
