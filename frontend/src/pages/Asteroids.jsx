import { useEffect, useMemo, useState } from "react";
import { getAsteroids } from "../api/space";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Unknown";

const fmt = (n, decimals = 2) =>
  n != null ? Number(n).toFixed(decimals) : "—";

const fmtKm = (n) => {
  const num = Number(n);
  if (isNaN(num)) return "—";
  return num >= 1000
    ? `${(num / 1000).toFixed(2)} M km`
    : `${num.toFixed(0)} km`;
};

/** Extract flat asteroid list from NASA NeoWs response */
const parseNeos = (data) => {
  if (!data?.near_earth_objects) return [];
  return Object.values(data.near_earth_objects)
    .flat()
    .sort((a, b) => {
      // Sort: hazardous first, then by closest miss distance
      if (a.is_potentially_hazardous_asteroid !== b.is_potentially_hazardous_asteroid)
        return a.is_potentially_hazardous_asteroid ? -1 : 1;
      const distA = Number(a.close_approach_data?.[0]?.miss_distance?.kilometers || Infinity);
      const distB = Number(b.close_approach_data?.[0]?.miss_distance?.kilometers || Infinity);
      return distA - distB;
    });
};

const getThreatLevel = (asteroid) => {
  const hazardous = asteroid.is_potentially_hazardous_asteroid;
  const missKm = Number(
    asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || Infinity,
  );
  const diamKm =
    (Number(asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0) +
      Number(asteroid.estimated_diameter?.kilometers?.estimated_diameter_min || 0)) /
    2;

  if (hazardous && missKm < 1_000_000)
    return { label: "High", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", dot: "bg-red-400" };
  if (hazardous)
    return { label: "Elevated", color: "text-orange-400", bg: "bg-orange-500/12 border-orange-500/25", dot: "bg-orange-400" };
  if (diamKm > 0.5)
    return { label: "Monitor", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" };
  return { label: "Safe", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/18", dot: "bg-emerald-400" };
};

const Skeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="h-24 animate-pulse rounded-2xl border border-white/8 bg-white/[0.05]"
        style={{ animationDelay: `${i * 60}ms` }}
      />
    ))}
  </div>
);

const AsteroidCard = ({ asteroid, onClick }) => {
  const approach = asteroid.close_approach_data?.[0] || {};
  const diam = asteroid.estimated_diameter?.kilometers || {};
  const diamAvg =
    ((Number(diam.estimated_diameter_min || 0) +
      Number(diam.estimated_diameter_max || 0)) /
      2).toFixed(3);
  const missKm = approach.miss_distance?.kilometers;
  const missAu = approach.miss_distance?.astronomical;
  const velocity = approach.relative_velocity?.kilometers_per_hour;
  const threat = getThreatLevel(asteroid);

  return (
    <button
      type="button"
      onClick={() => onClick(asteroid)}
      className={`group w-full overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] ${threat.bg}`}
    >
      <div className="flex flex-wrap items-center gap-4 px-5 py-4 sm:flex-nowrap">
        {/* threat dot */}
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${threat.dot} shadow-[0_0_8px_currentColor]`} />
          <span className={`text-[9px] font-semibold uppercase tracking-widest ${threat.color}`}>
            {threat.label}
          </span>
        </div>

        {/* name + approach date */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-semibold text-white">
            {asteroid.name}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Closest approach: {formatDate(approach.close_approach_date)}
          </p>
        </div>

        {/* stats row */}
        <div className="flex shrink-0 flex-wrap gap-x-6 gap-y-1 text-right">
          <div>
            <p className="font-mono text-xs text-zinc-400">{fmtKm(missKm)}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">Miss dist.</p>
          </div>
          <div>
            <p className="font-mono text-xs text-zinc-400">{fmt(missAu, 4)} AU</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">Astronomical</p>
          </div>
          <div>
            <p className="font-mono text-xs text-zinc-400">~{diamAvg} km</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">Diameter</p>
          </div>
          <div>
            <p className="font-mono text-xs text-zinc-400">
              {velocity ? `${Number(velocity).toLocaleString("en-IN", { maximumFractionDigits: 0 })} km/h` : "—"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">Velocity</p>
          </div>
        </div>

        <span className="shrink-0 text-xs text-zinc-600 transition-colors group-hover:text-zinc-400">
          Details →
        </span>
      </div>
    </button>
  );
};

const DetailModal = ({ asteroid, onClose }) => {
  if (!asteroid) return null;

  const approach = asteroid.close_approach_data?.[0] || {};
  const diam = asteroid.estimated_diameter || {};
  const threat = getThreatLevel(asteroid);

  const stats = [
    {
      label: "Miss Distance",
      value: fmtKm(approach.miss_distance?.kilometers),
      sub: `${fmt(approach.miss_distance?.astronomical, 4)} AU`,
    },
    {
      label: "Relative Velocity",
      value: approach.relative_velocity?.kilometers_per_hour
        ? `${Number(approach.relative_velocity.kilometers_per_hour).toLocaleString("en-IN", { maximumFractionDigits: 0 })} km/h`
        : "—",
      sub: approach.relative_velocity?.kilometers_per_second
        ? `${fmt(approach.relative_velocity.kilometers_per_second, 2)} km/s`
        : "",
    },
    {
      label: "Est. Diameter (km)",
      value: `${fmt(diam.kilometers?.estimated_diameter_min, 3)} – ${fmt(diam.kilometers?.estimated_diameter_max, 3)}`,
      sub: `${fmt(diam.meters?.estimated_diameter_min, 0)} – ${fmt(diam.meters?.estimated_diameter_max, 0)} m`,
    },
    {
      label: "Close Approach",
      value: formatDate(approach.close_approach_date),
      sub: approach.orbiting_body || "",
    },
    {
      label: "NASA ID",
      value: asteroid.id || "—",
      sub: "",
    },
    {
      label: "Absolute Magnitude",
      value: asteroid.absolute_magnitude_h != null ? `H = ${asteroid.absolute_magnitude_h}` : "—",
      sub: "Brightness (lower = brighter)",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        {/* close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-zinc-300 transition-colors hover:bg-white/12"
          aria-label="Close"
        >
          ✕
        </button>

        {/* header */}
        <div className={`border-b border-white/8 px-6 py-5 ${threat.bg}`}>
          <div className="flex items-center gap-3 pr-12">
            <span className={`h-3 w-3 rounded-full ${threat.dot}`} />
            <span className={`text-xs font-semibold uppercase tracking-widest ${threat.color}`}>
              {threat.label} threat level
            </span>
            {asteroid.is_potentially_hazardous_asteroid && (
              <span className="ml-auto rounded-full border border-red-500/30 bg-red-500/15 px-3 py-0.5 text-xs font-medium text-red-300">
                Potentially Hazardous
              </span>
            )}
          </div>
          <h2 className="mt-3 font-mono text-2xl font-bold text-white">
            {asteroid.name}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Near-Earth Object · {asteroid.orbital_data?.orbit_class?.orbit_class_description || "Asteroid"}
          </p>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-2 gap-px bg-white/8 sm:grid-cols-3">
          {stats.map(({ label, value, sub }) => (
            <div key={label} className="bg-zinc-950 p-5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-white">{value}</p>
              {sub && <p className="mt-0.5 text-xs text-zinc-600">{sub}</p>}
            </div>
          ))}
        </div>

        {/* footer link */}
        <div className="border-t border-white/8 px-6 py-4">
          <a
            href={asteroid.nasa_jpl_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-cyan-400 transition-colors hover:text-white"
          >
            View full orbit data on NASA JPL →
          </a>
        </div>
      </div>
    </div>
  );
};

const Asteroids = () => {
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "hazardous" | "safe"
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await getAsteroids();
        if (!active) return;
        setNeos(parseNeos(res.data));
      } catch (err) {
        if (!active) return;
        setError("Near-Earth object data could not be reached right now.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = neos;
    if (filter === "hazardous") list = list.filter((a) => a.is_potentially_hazardous_asteroid);
    if (filter === "safe") list = list.filter((a) => !a.is_potentially_hazardous_asteroid);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.name?.toLowerCase().includes(q));
    }
    return list;
  }, [neos, filter, query]);

  const hazardousCount = neos.filter((a) => a.is_potentially_hazardous_asteroid).length;
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-4 h-96 w-96 rounded-full bg-red-500/8 blur-3xl" />
        <div className="absolute right-[-9rem] top-28 h-[30rem] w-[30rem] rounded-full bg-orange-500/6 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-300/[0.05] blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/[0.08] px-4 py-2 text-xs font-medium text-red-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
              NASA Near-Earth Object tracker
            </span>
            <h1 className="text-4xl font-light leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
              Near-Earth<br />
              <span className="text-zinc-500">asteroid watch.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-zinc-400">
              Real-time tracking data from NASA's Center for Near Earth Object Studies (CNEOS)
              for <strong className="text-zinc-200">{today}</strong>. Sorted by proximity and
              threat level.
            </p>
          </div>

          {/* Summary stats */}
          {!loading && !error && (
            <div className="grid grid-cols-3 gap-3 text-center lg:grid-cols-1 lg:text-right">
              <div>
                <p className="font-mono text-3xl font-light text-white">{neos.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">Total NEOs today</p>
              </div>
              <div>
                <p className={`font-mono text-3xl font-light ${hazardousCount > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {hazardousCount}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">Potentially hazardous</p>
              </div>
              <div>
                <p className="font-mono text-3xl font-light text-zinc-400">{neos.length - hazardousCount}</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">Classified safe</p>
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {/* text search */}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-300/40 transition-colors"
            />

            {/* filter pills */}
            {[
              { key: "all", label: "All" },
              { key: "hazardous", label: "⚠ Hazardous only" },
              { key: "safe", label: "✓ Safe only" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  filter === key
                    ? "border-cyan-300/35 bg-cyan-300/12 text-cyan-100"
                    : "border-white/10 bg-white/[0.05] text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}

            <span className="ml-auto text-xs text-zinc-600">
              {filtered.length} asteroid{filtered.length !== 1 ? "s" : ""} shown
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-5 text-sm text-amber-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mb-5 flex flex-wrap gap-4 text-xs text-zinc-500">
            {[
              { dot: "bg-red-400", label: "High — hazardous, within 1M km" },
              { dot: "bg-orange-400", label: "Elevated — hazardous" },
              { dot: "bg-amber-400", label: "Monitor — large (>0.5 km)" },
              { dot: "bg-emerald-400", label: "Safe" },
            ].map(({ dot, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : filtered.length ? (
          <div className="space-y-2.5">
            {filtered.map((asteroid) => (
              <AsteroidCard
                key={asteroid.id}
                asteroid={asteroid}
                onClick={setSelected}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-sm text-zinc-500">
            No asteroids match your current filters.
          </div>
        )}
      </section>

      <DetailModal asteroid={selected} onClose={() => setSelected(null)} />
    </main>
  );
};

export default Asteroids;
