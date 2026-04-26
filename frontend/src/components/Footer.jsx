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
          Spaceflight News API
        </p>

        <div className="flex items-center gap-5">
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
