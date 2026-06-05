import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRockets } from "../api/space";

const fmt = (n, unit = "") =>
  n != null ? `${Number(n).toLocaleString()}${unit}` : "—";

const statusConfig = {
  active: {
    label: "Active",
    dot: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]",
    pill: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  },
  inactive: {
    label: "Retired",
    dot: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]",
    pill: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  },
};

const getStatus = (active) =>
  active ? statusConfig.active : statusConfig.inactive;

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
    <div className="h-56 animate-pulse bg-white/8" />
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="h-5 w-36 animate-pulse rounded-full bg-white/8" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-white/8" />
      </div>
      <div className="h-3 w-full animate-pulse rounded-full bg-white/8" />
      <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/8" />
      <div className="grid grid-cols-3 gap-3 pt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/8" />
        ))}
      </div>
    </div>
  </div>
);

const StatBlock = ({ label, value }) => (
  <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-center backdrop-blur-sm">
    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
  </div>
);

const RocketCard = ({ rocket, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const status = getStatus(rocket.active);
  const img = rocket.flickr_images?.[0];

  return (
    <Link
      to={`/rockets/${rocket.id}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_28px_64px_rgba(0,0,0,0.45)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* image */}
      <div className="relative h-56 overflow-hidden bg-zinc-950">
        {!imgLoaded && !imgFailed && (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,12,24,0.98)_0%,rgba(30,36,70,0.95)_52%,rgba(6,8,18,0.98)_100%)]">
            <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.05)_45%,transparent_70%)]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg
                className="h-16 w-16 text-white/10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                <path d="M12 2L8 8h8L12 2z" />
              </svg>
            </div>
          </div>
        )}
        {img && !imgFailed && (
          <img
            src={img}
            alt={rocket.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgFailed(true)}
            className={`h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        {/* status badge */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-md ${status.pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* success rate badge */}
        {rocket.success_rate_pct != null && (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-md">
              {rocket.success_rate_pct}% success
            </span>
          </div>
        )}
      </div>

      {/* body */}
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              {rocket.company || "SpaceX"}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
              {rocket.name}
            </h2>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-zinc-300">
            {rocket.stages ?? "—"} stage{rocket.stages !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="mb-5 line-clamp-2 text-sm leading-6 text-zinc-400">
          {rocket.description || "No description available."}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <StatBlock label="Height" value={fmt(rocket.height?.meters, " m")} />
          <StatBlock
            label="Mass"
            value={fmt(
              rocket.mass?.kg ? Math.round(rocket.mass.kg / 1000) : null,
              " t",
            )}
          />
          <StatBlock
            label="Payload LEO"
            value={
              rocket.payload_weights?.find((p) => p.id === "leo")
                ? fmt(
                    rocket.payload_weights.find((p) => p.id === "leo").kg,
                    " kg",
                  )
                : "—"
            }
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-zinc-600">
            First flight {rocket.first_flight || "unknown"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
            View specs
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

const Rockets = () => {
  const [rockets, setRockets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | inactive

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRockets();
      setRockets(res.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Failed to load rocket data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = rockets.filter((r) => {
    if (filter === "active") return r.active === true;
    if (filter === "inactive") return r.active === false;
    return true;
  });

  const filters = [
    { key: "all", label: "All Rockets" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Retired" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-20 pt-10 md:px-10 lg:px-14 xl:px-20">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      ></div>

      <section className="relative mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-5">
            <div>
              <h1 className="text-4xl font-light leading-none tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                The Rocket
                <br />
                <span className="text-zinc-500">Catalogue</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                Every vehicle built to breach the atmosphere — from Falcon's
                first flights to the colossal ambition of Starship. Explore
                engine specs, payload capacity, and mission history.
              </p>
            </div>
          </div>

          {/* stats summary */}
          {!loading && rockets.length > 0 && (
            <div className="flex shrink-0 gap-3">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/60 px-5 py-4 text-center backdrop-blur-xl">
                <p className="text-2xl font-semibold text-white">
                  {rockets.length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Total</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/6 px-5 py-4 text-center backdrop-blur-xl">
                <p className="text-2xl font-semibold text-emerald-300">
                  {rockets.filter((r) => r.active).length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Active</p>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/6 px-5 py-4 text-center backdrop-blur-xl">
                <p className="text-2xl font-semibold text-amber-300">
                  {rockets.filter((r) => !r.active).length}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Retired</p>
              </div>
            </div>
          )}
        </div>

        {/* filter pills */}
        <div className="mb-8 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filter === f.key
                  ? "border-violet-400/40 bg-violet-400/14 text-violet-100"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* error */}
        {error && (
          <div className="mb-8 rounded-3xl border border-red-400/20 bg-red-400/8 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-200">{error}</p>
              <button
                type="button"
                onClick={load}
                className="w-fit rounded-full bg-red-200 px-5 py-2 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <>
              {[0, 1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : filtered.length > 0 ? (
            filtered.map((rocket, i) => (
              <RocketCard key={rocket.id} rocket={rocket} index={i} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-white/12 bg-white/5 p-12 text-center text-sm text-zinc-500">
              No rockets match the current filter.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Rockets;
