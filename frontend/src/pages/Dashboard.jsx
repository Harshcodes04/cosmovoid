import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/useAuth";
import {
  getApod, getAsteroids, getJournalEntries,
  getLatestLaunch, getNews, getUpcomingLaunches,
} from "../api/space";

/* ── helpers ───────────────────────────────────────────────── */
const fmt = (v, extra = {}) =>
  v ? new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", day: "numeric",
    month: "short", year: "numeric", ...extra,
  }).format(new Date(v)) : "—";

const trim = (s, n) => s && s.length > n ? s.slice(0, n).trimEnd() + "…" : s || "";

const pickNext = (arr = []) =>
  [...arr].sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc))
    .find(l => new Date(l.date_utc) >= new Date());

const neos = p => {
  if (!p?.near_earth_objects) return [];
  const [d] = Object.keys(p.near_earth_objects);
  return p.near_earth_objects[d] || [];
};

const quickLinks = [
  { label: "Launches", to: "/launches", icon: "🚀", copy: "Track active missions" },
  { label: "Rockets",  to: "/rockets",  icon: "🛸", copy: "Explore rocket specs" },
  { label: "Crew",     to: "/crew",     icon: "👨‍🚀", copy: "Meet people in orbit" },
  { label: "Gallery",  to: "/gallery",  icon: "🌌", copy: "Browse NASA visuals" },
  { label: "News",     to: "/news",     icon: "📡", copy: "Space headlines today" },
  { label: "Events",   to: "/events",   icon: "🛰️", copy: "Cosmic events feed" },
];

/* ── reusable card shell ───────────────────────────────────── */
const Card = ({ children, className = "", style = {} }) => (
  <div
    style={style}
    className={`rounded-[1.75rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm ${className}`}
  >{children}</div>
);

const Label = ({ children }) => (
  <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">{children}</p>
);

const SectionHead = ({ label, title, to, linkLabel = "See all" }) => (
  <div className="flex items-center justify-between gap-4 mb-5">
    <div>
      <Label>{label}</Label>
      <h2 className="mt-1.5 text-xl font-medium tracking-[-0.04em] text-white">{title}</h2>
    </div>
    {to && (
      <Link to={to} className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/6 transition-colors">
        {linkLabel}
      </Link>
    )}
  </div>
);

/* ── loading skeleton ──────────────────────────────────────── */
const Skeleton = ({ h = "h-20" }) => (
  <div className={`${h} rounded-2xl bg-white/4 animate-pulse`} />
);

/* ══════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apodExpanded, setApodExpanded] = useState(false);
  const [snap, setSnap] = useState({
    apod: null, latestLaunch: null, nextLaunch: null,
    news: [], asteroids: [], journal: [],
  });

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      const [apodR, latR, upR, newsR, astR, jR] = await Promise.allSettled([
        getApod(), getLatestLaunch(), getUpcomingLaunches(),
        getNews(), getAsteroids(), getJournalEntries(),
      ]);
      if (!live) return;
      const ok = r => r.status === "fulfilled";
      setSnap({
        apod:        ok(apodR) ? apodR.value.data : null,
        latestLaunch:ok(latR)  ? latR.value.data  : null,
        nextLaunch:  ok(upR)   ? pickNext(upR.value.data) : null,
        news:        ok(newsR) ? newsR.value.data?.results || [] : [],
        asteroids:   ok(astR)  ? neos(astR.value.data) : [],
        journal:     ok(jR)    ? jR.value.data?.entries || [] : [],
      });
      const fails = [apodR,latR,upR,newsR,astR,jR].filter(r=>!ok(r)).length;
      if (fails === 6) setError("Mission Control could not reach its data feeds right now.");
      else if (fails > 0) setError("Some panels are temporarily offline.");
      setLoading(false);
    })();
    return () => { live = false; };
  }, []);

  const name       = user?.username || "Explorer";
  const journals   = snap.journal.slice(0, 4);
  const newsItems  = snap.news.slice(0, 3);
  const watchlist  = snap.asteroids.slice(0, 3);
  const apodText   = snap.apod?.explanation || "";
  const apodLong   = apodText.length > 200;

  /* ── right sidebar ─────────────────────────────────────────── */
  const Sidebar = () => (
    <div className="space-y-5">
      {/* Pilot */}
      <Card className="bg-gradient-to-b from-cyan-400/10 to-transparent p-5">
        <Label>Pilot profile</Label>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300/15 border border-cyan-300/20 text-cyan-200 text-lg font-semibold select-none">
            {name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Mission ready</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
            Online
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Journal", snap.journal.length],
            ["Headlines", snap.news.length],
            ["NEOs", snap.asteroids.length],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-black/20 py-2.5">
              <p className="text-lg font-semibold text-white">{v}</p>
              <p className="text-[10px] text-zinc-500">{k}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Journal rail */}
      <Card className="bg-zinc-950/70 p-5">
        <SectionHead label="Your journal" title="Recent entries" to="/journal" />
        <div className="space-y-3">
          {loading ? <Skeleton /> : journals.length ? journals.map(e => (
            <Link key={e._id} to={`/journal/${e._id}`}
              className="block rounded-xl border border-white/8 bg-black/20 p-3.5 hover:border-cyan-300/20 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white leading-tight">{trim(e.title, 38)}</p>
                {e.mood && <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-zinc-400">{e.mood}</span>}
              </div>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">{trim(e.content, 80)}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600">{fmt(e.createdAt)}</p>
            </Link>
          )) : (
            <p className="rounded-xl border border-dashed border-white/10 p-4 text-xs text-zinc-500">
              Your journal entries will appear here.
            </p>
          )}
        </div>
        <div className="mt-4 grid gap-2">
          <Link to="/journal/new"
            className="flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:-translate-y-0.5 transition-transform">
            + Write new entry
          </Link>
          <Link to="/journal"
            className="flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/10 transition-colors">
            Open journal
          </Link>
        </div>
      </Card>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes dashFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .dash-animate{animation:dashFadeUp 0.7s cubic-bezier(.22,1,.36,1) both}
        .dash-animate:nth-child(1){animation-delay:.05s}
        .dash-animate:nth-child(2){animation-delay:.12s}
        .dash-animate:nth-child(3){animation-delay:.18s}
        .dash-animate:nth-child(4){animation-delay:.24s}
        .dash-animate:nth-child(5){animation-delay:.30s}
        .dash-animate:nth-child(6){animation-delay:.36s}
        .ql-card:hover{transform:translateY(-3px)}
        .ql-card{transition:transform .25s,border-color .25s}
      `}</style>

      <header><Navbar /></header>

      <main className="relative min-h-screen overflow-x-hidden px-5 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">

        {/* nebula bg */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="cosmos-nebula absolute -left-20 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="cosmos-drift absolute -right-20 top-32 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/6 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_340px]">

          {/* ── MAIN COLUMN ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* HERO */}
            <Card className="dash-animate overflow-hidden bg-gradient-to-br from-[#0d1b3e] via-[#0a1228] to-[#060a18] p-7 sm:p-9">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
              <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] text-cyan-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,1)]" />
                    Personal Mission Control
                  </span>
                  <h1 className="text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl">
                    Welcome back,<br />
                    <span className="font-semibold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{name}</span>
                  </h1>
                  <p className="max-w-lg text-sm leading-7 text-zinc-400">
                    Your command deck pulls live launches, NASA imagery, space headlines, asteroid alerts, and your personal journal — all in one orbit.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link to="/journal" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:-translate-y-0.5 transition-transform">
                    Open journal
                  </Link>
                  <Link to="/explore" className="rounded-full border border-white/14 bg-white/6 px-5 py-2.5 text-sm text-zinc-200 hover:bg-white/10 transition-colors">
                    Explore
                  </Link>
                </div>
              </div>

              {/* stat chips */}
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[
                  { label: "Journal entries", value: snap.journal.length, color: "text-violet-300" },
                  { label: "Headlines live",  value: snap.news.length,    color: "text-cyan-300" },
                  { label: "Asteroids today", value: snap.asteroids.length, color: "text-amber-300" },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <p className={`text-3xl font-semibold ${s.color}`}>{loading ? "—" : s.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-xs text-amber-200">
                  ⚠ {error}
                </div>
              )}
            </Card>

            {/* APOD + LAUNCH ROW */}
            <div className="dash-animate grid gap-6 lg:grid-cols-2">

              {/* APOD */}
              <Card className="overflow-hidden bg-zinc-950/80">
                {snap.apod?.media_type === "image" ? (
                  <img src={snap.apod.url} alt={snap.apod.title}
                    className="h-52 w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gradient-to-b from-sky-900/40 to-zinc-950">
                    <p className="text-sm text-zinc-500">Video / feed pending</p>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Label>Picture of the day</Label>
                      <h2 className="mt-1.5 text-lg font-medium text-white leading-snug">
                        {loading ? "Loading…" : snap.apod?.title || "Awaiting NASA feed"}
                      </h2>
                    </div>
                    <Link to="/gallery" className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400 hover:bg-white/6 transition-colors">
                      Gallery
                    </Link>
                  </div>
                  {loading ? <Skeleton h="h-10" /> : (
                    <p className="text-xs leading-6 text-zinc-400">
                      {apodText ? (apodExpanded ? apodText : trim(apodText, 200)) : "Sky story pending."}
                    </p>
                  )}
                  {apodLong && (
                    <button onClick={() => setApodExpanded(x => !x)}
                      className="text-xs font-medium text-cyan-300 hover:text-white transition-colors">
                      {apodExpanded ? "Show less ↑" : "Read more ↓"}
                    </button>
                  )}
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                    {snap.apod?.date ? `Captured ${fmt(snap.apod.date)}` : ""}
                  </p>
                </div>
              </Card>

              {/* LAUNCH PULSE */}
              <Card className="bg-gradient-to-b from-[#141d40]/90 to-zinc-950/80 p-5 space-y-4">
                <SectionHead label="Flight deck" title="Launch pulse" to="/launches" linkLabel="All launches" />

                {/* Latest */}
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 space-y-2">
                  <Label>Latest launch</Label>
                  {loading ? <Skeleton h="h-14" /> : (
                    <>
                      <p className="text-base font-semibold text-white">
                        {snap.latestLaunch?.name || "—"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {fmt(snap.latestLaunch?.date_utc, { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}
                      </p>
                      <p className="text-xs leading-5 text-zinc-400">
                        {trim(snap.latestLaunch?.details, 110) || "Summary unavailable."}
                      </p>
                    </>
                  )}
                </div>

                {/* Next */}
                <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/6 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Next launch</Label>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
                  </div>
                  {loading ? <Skeleton h="h-14" /> : (
                    <>
                      <p className="text-base font-semibold text-white">
                        {snap.nextLaunch?.name || "Watching for window…"}
                      </p>
                      <p className="text-xs text-cyan-300/80">
                        {fmt(snap.nextLaunch?.date_utc, { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}
                      </p>
                      <p className="text-xs leading-5 text-zinc-400">
                        {trim(snap.nextLaunch?.details, 110) || "Schedule will appear when feed updates."}
                      </p>
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* NEWS + ASTEROIDS */}
            <div className="dash-animate grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

              {/* NEWS */}
              <Card className="bg-zinc-950/80 p-5">
                <SectionHead label="Top stories" title="Space news briefing" to="/news" linkLabel="Open news" />
                <div className="space-y-3">
                  {loading ? [1,2,3].map(i => <Skeleton key={i} />) :
                    newsItems.length ? newsItems.map(s => (
                      <div key={s.id} className="rounded-2xl border border-white/8 bg-black/20 p-4 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                          <span className="rounded-full border border-white/10 px-2 py-0.5">{s.news_site}</span>
                          <span>{fmt(s.published_at)}</span>
                        </div>
                        <p className="text-sm font-medium text-white leading-snug">{s.title}</p>
                        <p className="text-xs leading-5 text-zinc-400">{trim(s.summary, 130)}</p>
                        <a href={s.url} target="_blank" rel="noreferrer"
                          className="text-[11px] font-medium text-cyan-300 hover:text-white transition-colors">
                          Read source ↗
                        </a>
                      </div>
                    )) : (
                      <p className="rounded-2xl border border-dashed border-white/10 p-4 text-xs text-zinc-500">
                        News feed pending.
                      </p>
                    )}
                </div>
              </Card>

              {/* ASTEROIDS */}
              <Card className="bg-gradient-to-b from-emerald-950/30 to-zinc-950/80 p-5">
                <SectionHead label="Near-Earth objects" title="Asteroid watch" to="/asteroids" linkLabel="Full list" />
                <div className="space-y-3">
                  {loading ? [1,2,3].map(i => <Skeleton key={i} />) :
                    watchlist.length ? watchlist.map(a => {
                      const hazard = a.is_potentially_hazardous_asteroid;
                      const km = Math.round(a.estimated_diameter?.kilometers?.estimated_diameter_max || 0);
                      const miss = Number(a.close_approach_data?.[0]?.miss_distance?.kilometers || 0)
                        .toLocaleString("en-IN", { maximumFractionDigits: 0 });
                      return (
                        <div key={a.id} className={`rounded-2xl border p-4 space-y-1.5 ${hazard ? "border-red-500/20 bg-red-500/6" : "border-white/8 bg-black/20"}`}>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white leading-tight">{a.name}</p>
                            {hazard && (
                              <span className="shrink-0 rounded-full border border-red-400/30 bg-red-500/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-red-300">
                                Hazardous
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400">Diameter ≤ {km} km</p>
                          <p className="text-[11px] text-zinc-400">Miss {miss} km</p>
                        </div>
                      );
                    }) : (
                      <p className="rounded-2xl border border-dashed border-white/10 p-4 text-xs text-zinc-500">
                        Asteroid feed pending.
                      </p>
                    )}
                </div>
              </Card>
            </div>

            {/* QUICK NAV */}
            <Card className="dash-animate bg-zinc-950/70 p-5">
              <SectionHead label="Jump points" title="Explore Cosmovoid" to="/explore" linkLabel="Explore all" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickLinks.map(q => (
                  <Link key={q.to} to={q.to}
                    className="ql-card group rounded-2xl border border-white/8 bg-black/20 p-4 hover:border-cyan-300/20 hover:bg-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{q.icon}</span>
                      <p className="text-sm font-semibold text-white">{q.label}</p>
                    </div>
                    <p className="text-xs text-zinc-500 leading-5">{q.copy}</p>
                    <p className="mt-2 text-[11px] font-medium text-cyan-300 group-hover:text-white transition-colors">Open →</p>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* ── SIDEBAR ─────────────────────────────────────────── */}
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>
        </div>

        {/* mobile sidebar */}
        <div className="mx-auto mt-6 max-w-7xl xl:hidden">
          <Sidebar />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
