import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getRocketById } from "../api/space";

/* ── helpers ── */
const fmt = (n, unit = "") =>
  n != null && n !== "" ? `${Number(n).toLocaleString()}${unit}` : "—";

const fmtBool = (v) =>
  v === true ? (
    <span className="text-emerald-400">Yes</span>
  ) : v === false ? (
    <span className="text-red-400">No</span>
  ) : (
    <span className="text-zinc-500">—</span>
  );

/* ── skeleton ── */
const SkeletonDetail = () => (
  <div className="mx-auto max-w-7xl space-y-8 px-5 pb-24 pt-10 md:px-10 lg:px-14 xl:px-20">
    <div className="h-6 w-32 animate-pulse rounded-full bg-white/8" />
    <div className="h-10 w-72 animate-pulse rounded-2xl bg-white/8" />
    <div className="h-[420px] animate-pulse rounded-3xl bg-white/8" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/8" />
      ))}
    </div>
    <div className="h-48 animate-pulse rounded-3xl bg-white/8" />
  </div>
);

/* ── image carousel ── */
const ImageCarousel = ({ images = [], name = "" }) => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState({});
  const [failed, setFailed] = useState({});

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length],
  );

  if (!images.length) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/60 text-zinc-600">
        No imagery available
      </div>
    );
  }

  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
      {!loaded[current] && !failed[current] && (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,rgba(8,12,24,1)_0%,rgba(30,36,70,0.95)_52%,rgba(6,8,18,1)_100%)]" />
      )}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${name} — ${i + 1}`}
          onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
          onError={() => setFailed((p) => ({ ...p, [i]: true }))}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      ))}
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

      {/* controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M10 3L5 8l5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M6 3l5 5-5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ── stat card ── */
const StatCard = ({ label, value, sub, accent = "violet" }) => {
  const accents = {
    violet: "border-zinc-400/15 bg-zinc-400/5",
    cyan: "border-cyan-400/15 bg-cyan-400/5",
    amber: "border-amber-400/15 bg-amber-400/5",
    emerald: "border-emerald-400/15 bg-emerald-400/5",
  };
  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-sm ${accents[accent] || accents.violet}`}
    >
      <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
};

/* ── spec row ── */
const SpecRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-white/6 py-3 last:border-b-0">
    <span className="text-sm text-zinc-500">{label}</span>
    <span className="text-right text-sm font-medium text-zinc-200">
      {value}
    </span>
  </div>
);

/* ── section heading ── */
const SectionHeading = ({ children }) => (
  <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold text-white">
    <span className="h-px flex-1 bg-white/8" />
    {children}
    <span className="h-px flex-1 bg-white/8" />
  </h2>
);

/* ── main component ── */
const RocketDetails = () => {
  const { id } = useParams();
  const [rocket, setRocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getRocketById(id);
        setRocket(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.error || "Could not load rocket details.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <main className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-28 top-8 h-[28rem] w-[28rem] rounded-full bg-zinc-600/8 blur-3xl" />
        </div>
        <SkeletonDetail />
      </main>
    );

  if (error)
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="space-y-5">
          <p className="text-sm text-zinc-400">{error}</p>
          <Link
            to="/rockets"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/8 hover:text-white"
          >
            ← Back to Fleet
          </Link>
        </div>
      </main>
    );

  if (!rocket) return null;

  const statusCfg = rocket.active
    ? {
        label: "Active",
        dot: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]",
        text: "text-emerald-300",
      }
    : {
        label: "Retired",
        dot: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]",
        text: "text-amber-300",
      };

  const leoPayload = rocket.payload_weights?.find((p) => p.id === "leo");
  const gtoPayload = rocket.payload_weights?.find((p) => p.id === "gto");

  return (
    <main className="relative min-h-screen overflow-hidden pb-24 pt-10">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-28 top-8 h-[28rem] w-[28rem] rounded-full bg-zinc-600/8 blur-3xl" />
        <div className="absolute right-[-8rem] top-32 h-[32rem] w-[32rem] rounded-full bg-cyan-500/6 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-zinc-700/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10 lg:px-14 xl:px-20">
        {/* breadcrumb */}
        <Link
          to="/rockets"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M10 3L5 8l5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          SpaceX Fleet
        </Link>

        {/* title row */}
        <div className="mt-5 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
                {rocket.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium backdrop-blur-md ${statusCfg.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              {rocket.company} · First flight {rocket.first_flight || "unknown"}{" "}
              · {rocket.country}
            </p>
          </div>
          {rocket.wikipedia && (
            <a
              href={rocket.wikipedia}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-zinc-300 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
            >
              Wikipedia
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 3h7v7M13 3L3 13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>

        {/* hero image carousel */}
        <ImageCarousel images={rocket.flickr_images || []} name={rocket.name} />

        {/* description */}
        {rocket.description && (
          <p className="mt-8 max-w-4xl text-base leading-8 text-zinc-300">
            {rocket.description}
          </p>
        )}

        {/* top-level stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Height"
            value={fmt(rocket.height?.meters, " m")}
            sub={fmt(rocket.height?.feet, " ft")}
            accent="violet"
          />
          <StatCard
            label="Diameter"
            value={fmt(rocket.diameter?.meters, " m")}
            sub={fmt(rocket.diameter?.feet, " ft")}
            accent="cyan"
          />
          <StatCard
            label="Mass"
            value={
              rocket.mass?.kg
                ? fmt(Math.round(rocket.mass.kg / 1000), " t")
                : "—"
            }
            sub={rocket.mass?.lb ? fmt(rocket.mass.lb, " lb") : undefined}
            accent="amber"
          />
          <StatCard
            label="Success Rate"
            value={
              rocket.success_rate_pct != null
                ? `${rocket.success_rate_pct}%`
                : "—"
            }
            sub={`${rocket.stages ?? "—"} stage vehicle`}
            accent="emerald"
          />
        </div>

        {/* two-column layout below */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* left: engine + stage specs */}
          <div className="space-y-6">
            {/* engine specs */}
            {rocket.engines && (
              <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl">
                <h2 className="mb-5 text-lg font-semibold text-white">
                  Engine Specifications
                </h2>
                <div className="grid grid-cols-2 gap-x-8">
                  <SpecRow
                    label="Engine type"
                    value={`${rocket.engines.type ?? "—"} ${rocket.engines.version ?? ""}`.trim()}
                  />
                  <SpecRow
                    label="Layout"
                    value={rocket.engines.layout ?? "—"}
                  />
                  <SpecRow
                    label="Engines (1st stage)"
                    value={fmt(rocket.engines.number)}
                  />
                  <SpecRow
                    label="Propellants"
                    value={
                      [rocket.engines.propellant_1, rocket.engines.propellant_2]
                        .filter(Boolean)
                        .join(" / ") || "—"
                    }
                  />
                  <SpecRow
                    label="Thrust (sea level)"
                    value={
                      rocket.engines.thrust_sea_level
                        ? `${fmt(rocket.engines.thrust_sea_level.kN, " kN")} / ${fmt(rocket.engines.thrust_sea_level.lbf, " lbf")}`
                        : "—"
                    }
                  />
                  <SpecRow
                    label="Thrust (vacuum)"
                    value={
                      rocket.engines.thrust_vacuum
                        ? `${fmt(rocket.engines.thrust_vacuum.kN, " kN")} / ${fmt(rocket.engines.thrust_vacuum.lbf, " lbf")}`
                        : "—"
                    }
                  />
                  <SpecRow
                    label="Thrust-to-weight"
                    value={fmt(rocket.engines.thrust_to_weight)}
                  />
                  <SpecRow
                    label="Specific impulse (vac)"
                    value={
                      rocket.engines.isp?.vacuum
                        ? `${rocket.engines.isp.vacuum} s`
                        : "—"
                    }
                  />
                </div>
              </div>
            )}

            {/* first stage */}
            {rocket.first_stage && (
              <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl">
                <h2 className="mb-5 text-lg font-semibold text-white">
                  First Stage
                </h2>
                <div className="grid grid-cols-2 gap-x-8">
                  <SpecRow
                    label="Reusable"
                    value={fmtBool(rocket.first_stage.reusable)}
                  />
                  <SpecRow
                    label="Engines"
                    value={fmt(rocket.first_stage.engines)}
                  />
                  <SpecRow
                    label="Fuel (tonnes)"
                    value={fmt(rocket.first_stage.fuel_amount_tons, " t")}
                  />
                  <SpecRow
                    label="Burn time"
                    value={
                      rocket.first_stage.burn_time_sec
                        ? `${rocket.first_stage.burn_time_sec} s`
                        : "—"
                    }
                  />
                  <SpecRow
                    label="Thrust (sea level)"
                    value={
                      rocket.first_stage.thrust_sea_level
                        ? `${fmt(rocket.first_stage.thrust_sea_level.kN, " kN")}`
                        : "—"
                    }
                  />
                  <SpecRow
                    label="Thrust (vacuum)"
                    value={
                      rocket.first_stage.thrust_vacuum
                        ? `${fmt(rocket.first_stage.thrust_vacuum.kN, " kN")}`
                        : "—"
                    }
                  />
                </div>
              </div>
            )}

            {/* second stage */}
            {rocket.second_stage && (
              <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl">
                <h2 className="mb-5 text-lg font-semibold text-white">
                  Second Stage
                </h2>
                <div className="grid grid-cols-2 gap-x-8">
                  <SpecRow
                    label="Reusable"
                    value={fmtBool(rocket.second_stage.reusable)}
                  />
                  <SpecRow
                    label="Engines"
                    value={fmt(rocket.second_stage.engines)}
                  />
                  <SpecRow
                    label="Fuel (tonnes)"
                    value={fmt(rocket.second_stage.fuel_amount_tons, " t")}
                  />
                  <SpecRow
                    label="Burn time"
                    value={
                      rocket.second_stage.burn_time_sec
                        ? `${rocket.second_stage.burn_time_sec} s`
                        : "—"
                    }
                  />
                  <SpecRow
                    label="Thrust"
                    value={
                      rocket.second_stage.thrust
                        ? `${fmt(rocket.second_stage.thrust.kN, " kN")}`
                        : "—"
                    }
                  />
                  {rocket.second_stage.payloads?.option_1 && (
                    <SpecRow
                      label="Fairing option"
                      value={rocket.second_stage.payloads.option_1}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* right: payload + landing */}
          <div className="space-y-6">
            {/* payload weights */}
            {rocket.payload_weights?.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl">
                <h2 className="mb-5 text-lg font-semibold text-white">
                  Payload Capacity
                </h2>
                <div className="space-y-0">
                  {rocket.payload_weights.map((pw) => (
                    <div
                      key={pw.id}
                      className="flex items-center justify-between border-b border-white/6 py-3 last:border-b-0"
                    >
                      <span className="text-sm text-zinc-400">{pw.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          {fmt(pw.kg, " kg")}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {fmt(pw.lb, " lb")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* landing legs */}
            {rocket.landing_legs && (
              <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl">
                <h2 className="mb-5 text-lg font-semibold text-white">
                  Landing Legs
                </h2>
                <SpecRow
                  label="Number of legs"
                  value={fmt(rocket.landing_legs.number)}
                />
                <SpecRow
                  label="Material"
                  value={rocket.landing_legs.material || "—"}
                />
              </div>
            )}

            {/* cost & booster */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-xl">
              <h2 className="mb-5 text-lg font-semibold text-white">
                Mission Economics
              </h2>
              <SpecRow
                label="Cost per launch"
                value={
                  rocket.cost_per_launch
                    ? `$${Number(rocket.cost_per_launch).toLocaleString()}`
                    : "—"
                }
              />
              <SpecRow label="Boosters" value={fmt(rocket.boosters)} />
              <SpecRow label="Stages" value={fmt(rocket.stages)} />
              {leoPayload && (
                <SpecRow
                  label="LEO payload"
                  value={fmt(leoPayload.kg, " kg")}
                />
              )}
              {gtoPayload && (
                <SpecRow
                  label="GTO payload"
                  value={fmt(gtoPayload.kg, " kg")}
                />
              )}
            </div>

            {/* thumbnail strip */}
            {(rocket.flickr_images?.length ?? 0) > 1 && (
              <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-4 backdrop-blur-xl">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-zinc-600">
                  Gallery
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {rocket.flickr_images.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${rocket.name} ${i + 1}`}
                      loading="lazy"
                      className="h-16 w-24 shrink-0 rounded-xl object-cover object-center opacity-70 transition-opacity hover:opacity-100"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* back CTA */}
        <div className="mt-14 border-t border-white/8 pt-10">
          <Link
            to="/rockets"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-200 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M10 3L5 8l5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Fleet
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RocketDetails;
