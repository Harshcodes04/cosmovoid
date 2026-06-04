import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/useAuth";
import {
  getApod,
  getAsteroids,
  getJournalEntries,
  getNews,
  getGlobalUpcomingLaunches,
  getGlobalPreviousLaunches,
} from "../api/space";

const fmt = (v, extra = {}) =>
  v
    ? new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
        ...extra,
      }).format(new Date(v))
    : "—";

const trim = (s, n) =>
  s && s.length > n ? s.slice(0, n).trimEnd() + "…" : s || "";

const pickNext = (arr = []) =>
  [...arr]
    .sort(
      (a, b) => new Date(a.date_utc || a.net) - new Date(b.date_utc || b.net),
    )
    .find((l) => new Date(l.date_utc || l.net) >= new Date());

const neos = (p) => {
  if (!p?.near_earth_objects) return [];
  const [d] = Object.keys(p.near_earth_objects);
  return p.near_earth_objects[d] || [];
};

const quickLinks = [
  { prefix: "[L]", label: "Launches", to: "/launches" },
  { prefix: "[R]", label: "Rockets", to: "/rockets" },
  { prefix: "[C]", label: "Crew", to: "/crew" },
  { prefix: "[G]", label: "Gallery", to: "/gallery" },
  { prefix: "[N]", label: "News", to: "/news" },
  { prefix: "[E]", label: "Events", to: "/events" },
];

const Box = ({ children, className = "", variant = "gray" }) => {
  const styles = {
    black: "bg-black border-zinc-900",
    gray: "bg-zinc-950 border-zinc-800",
    blue: "bg-[#0a0c18] border-[#161c36]",
  };
  return (
    <div
      className={`border rounded-2xl ${styles[variant]} p-6 lg:p-8 ${className}`}
    >
      {children}
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <div className="mb-6">
    <h2 className="text-sm font-bold text-white uppercase tracking-widest">
      {title}
    </h2>
  </div>
);

const Loader = () => (
  <p className="text-xs text-zinc-400 font-mono animate-pulse">
    [ Awaiting Data Stream... ]
  </p>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apodExpanded, setApodExpanded] = useState(false);
  const [snap, setSnap] = useState({
    apod: null,
    latestLaunch: null,
    nextLaunch: null,
    news: [],
    asteroids: [],
    journal: [],
  });

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      const [apodR, latR, upR, newsR, astR, jR] = await Promise.allSettled([
        getApod(),
        getGlobalPreviousLaunches(1),
        getGlobalUpcomingLaunches(5),
        getNews(),
        getAsteroids(),
        getJournalEntries(),
      ]);
      if (!live) return;
      const ok = (r) => r.status === "fulfilled";
      setSnap({
        apod: ok(apodR) ? apodR.value.data : null,
        latestLaunch: ok(latR) ? latR.value.data?.results?.[0] : null,
        nextLaunch: ok(upR) ? pickNext(upR.value.data?.results) : null,
        news: ok(newsR) ? newsR.value.data?.results || [] : [],
        asteroids: ok(astR) ? neos(astR.value.data) : [],
        journal: ok(jR) ? jR.value.data?.entries || [] : [],
      });
      const fails = [apodR, latR, upR, newsR, astR, jR].filter(
        (r) => !ok(r),
      ).length;
      if (fails === 6)
        setError("Mission Control could not reach its data feeds right now.");
      else if (fails > 0) setError("Some panels are temporarily offline.");
      setLoading(false);
    })();
    return () => {
      live = false;
    };
  }, []);

  const name = user?.username || "Explorer";
  const journals = snap.journal.slice(0, 4);
  const newsItems = snap.news.slice(0, 4);
  const watchlist = snap.asteroids.slice(0, 4);
  const apodText = snap.apod?.explanation || "";
  const apodLong = apodText.length > 250;

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="min-h-screen px-6 pt-6 pb-20 md:px-10 lg:px-14 xl:px-20 max-w-[1400px] mx-auto selection:bg-zinc-800 selection:text-white font-sans">
        {/* HERO */}
        <section className="mb-12">
          <h1 className="text-3xl sm:text-4xl text-white font-medium tracking-tight mb-3">
            Mission Control
          </h1>
          <p className="max-w-2xl text-zinc-400 text-sm leading-relaxed mb-6 font-mono">
            &gt; Pilot: {name} <br />
            &gt; Status: Online
          </p>
          {error && (
            <p className="text-xs text-red-400 mb-6 font-mono">[!] {error}</p>
          )}
        </section>

        {/* SYMMETRIC GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Box className="lg:col-span-2" variant="black">
            <SectionTitle title="Astronomy Picture of the Day" />
            <div className="flex flex-col lg:flex-row gap-8 lg:h-[380px]">
              {/* Media Block (Left) */}
              <div className="flex-shrink-0 lg:w-[50%] xl:w-[60%] h-64 lg:h-full">
                {loading ? (
                  <div className="h-full w-full border border-dashed border-zinc-800 flex items-center justify-center bg-zinc-950">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {snap.apod?.media_type === "image" ? (
                      <img
                        src={snap.apod.url}
                        alt={snap.apod.title}
                        className="h-full w-full object-cover border border-zinc-900"
                        loading="lazy"
                      />
                    ) : snap.apod?.media_type === "video" ? (
                      snap.apod.url.endsWith(".mp4") ? (
                        <video
                          src={snap.apod.url}
                          className="h-full w-full object-cover bg-black border border-zinc-900"
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <iframe
                          src={snap.apod.url}
                          title={snap.apod.title}
                          className="h-full w-full object-cover border border-zinc-900"
                          allowFullScreen
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center border border-zinc-900 bg-zinc-950">
                        <p className="text-xs text-zinc-400 font-mono">
                          [ Visual feed pending ]
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Text Block (Right) */}
              <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <h3 className="text-zinc-100 font-medium mb-4 text-lg tracking-wide">
                      {snap.apod?.title || "Awaiting NASA feed"}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-serif tracking-wide">
                      {apodText
                        ? apodExpanded
                          ? apodText
                          : trim(apodText, 500)
                        : "Sky story pending."}
                    </p>
                    {apodLong && (
                      <button
                        onClick={() => setApodExpanded((x) => !x)}
                        className="text-xs font-mono text-zinc-300 hover:text-white transition-colors mt-6 block"
                      >
                        {apodExpanded ? "[- Collapse]" : "[+ Expand]"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Box>

          <Box variant="blue" className="h-full">
            <SectionTitle title="Launches" />
            <div className="space-y-8">
              <div>
                <p className="text-xs text-zinc-300 font-mono mb-2 uppercase tracking-widest">
                  Latest Launch
                </p>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <p className="text-base text-zinc-200 font-medium tracking-wide">
                      {snap.latestLaunch?.name || "—"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                      {fmt(snap.latestLaunch?.net, {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZoneName: "short",
                      }) || "—"}
                    </p>
                  </>
                )}
              </div>
              <div className="pt-6 border-t border-[#161c36]">
                <p className="text-xs text-zinc-300 font-mono mb-2 uppercase tracking-widest">
                  Next Launch
                </p>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <p className="text-base text-zinc-200 font-medium tracking-wide">
                      {snap.nextLaunch?.name || "Watching for window..."}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                      {fmt(snap.nextLaunch?.net, {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZoneName: "short",
                      }) || "—"}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#161c36]">
              <Link
                to="/launches"
                className="text-xs font-mono text-white hover:text-white transition-colors"
              >
                &gt; Access full schedule
              </Link>
            </div>
          </Box>

          <Box variant="gray" className="h-full">
            <SectionTitle title="Asteroids closest to earth today" />
            <div className="space-y-5">
              {loading ? (
                <Loader />
              ) : watchlist.length ? (
                watchlist.map((a) => {
                  const hazard = a.is_potentially_hazardous_asteroid;
                  const miss = Number(
                    a.close_approach_data?.[0]?.miss_distance?.kilometers || 0,
                  ).toLocaleString("en-IN", { maximumFractionDigits: 0 });

                  return (
                    <div
                      key={a.id}
                      className={`border-l pl-4 ${
                        hazard ? "border-red-900" : "border-zinc-800"
                      }`}
                    >
                      <p className="text-sm text-zinc-200 font-medium tracking-wide">
                        {a.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1 font-mono">
                        dist: {miss}km
                        {hazard && (
                          <span className="text-red-500 ml-3 uppercase tracking-widest text-[10px]">
                            Hazard
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-zinc-400 font-mono">
                  No imminent data.
                </p>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-800/50">
              <Link
                to="/asteroids"
                className="text-xs font-mono text-white hover:text-white transition-colors"
              >
                &gt; View all asteroids and their severity level
              </Link>
            </div>
          </Box>

          <Box variant="gray" className="h-full">
            <SectionTitle title="Fresh Space News" />
            <div className="flex flex-col gap-6">
              {loading ? (
                <Loader />
              ) : newsItems.length ? (
                newsItems.slice(0, 3).map((s) => (
                  <article
                    key={s.id}
                    className="border-t border-zinc-800/50 pt-5 first:border-0 first:pt-0"
                  >
                    <p className="text-[10px] text-zinc-300 font-mono mb-2 uppercase tracking-widest">
                      {s.news_site}
                    </p>
                    <h3 className="text-sm text-zinc-200 font-medium leading-relaxed mb-3">
                      {s.title}
                    </h3>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                    >
                      [ Read Source ]
                    </a>
                  </article>
                ))
              ) : (
                <p className="text-xs text-zinc-400 font-mono">
                  No transmissions.
                </p>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-800/50">
              <Link
                to="/news"
                className="text-xs font-mono text-white hover:text-white transition-colors"
              >
                &gt; Checkout more
              </Link>
            </div>
          </Box>

          <Box variant="blue" className="h-full">
            <SectionTitle title="Explore Other Sections" />
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex items-center gap-3 p-4 border border-[#161c36] hover:border-[#2a345e] bg-[#0a0c18] hover:bg-[#0c1024] transition-colors"
                >
                  <span className="text-zinc-400 font-mono text-xs">
                    {l.prefix}
                  </span>
                  <span className="text-sm text-zinc-300 font-medium">
                    {l.label}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[#161c36]">
              <Link
                to="/explore"
                className="text-xs font-mono text-white hover:text-white transition-colors"
              >
                &gt; View all sections
              </Link>
            </div>
          </Box>

          <Box className="lg:col-span-2" variant="black">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">
                Recent Journal Entries
              </h2>
              <Link
                to="/journal/new"
                className="text-xs font-mono text-white hover:text-white transition-colors"
              >
                [+ Write Entry]
              </Link>
            </div>

            <div className="flex flex-col gap-5">
              {loading ? (
                <Loader />
              ) : journals.length ? (
                journals.map((e) => (
                  <Link
                    key={e._id}
                    to={`/journal/${e._id}`}
                    className="flex justify-between items-center border-b border-zinc-900 pb-4 hover:border-zinc-700 transition-colors group"
                  >
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors font-medium tracking-wide">
                      {trim(e.title, 80)}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono group-hover:text-zinc-400 transition-colors">
                      {fmt(e.createdAt)}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-zinc-400 font-mono">
                  No logs detected in local storage.
                </p>
              )}

              {!loading && journals.length > 0 && (
                <div className="pt-2">
                  <Link
                    to="/journal"
                    className="text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                  >
                    &gt; Access Full Archive
                  </Link>
                </div>
              )}
            </div>
          </Box>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
