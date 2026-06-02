import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGlobalLaunchById } from "../api/space";

const STATUS_MAP = {
  1: {
    label: "Go for Launch",
    pill: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  },
  2: {
    label: "TBD",
    pill: "border-zinc-600/40 bg-zinc-600/20 text-zinc-400",
    dot: "bg-zinc-500",
  },
  3: {
    label: "TBC",
    pill: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
  4: {
    label: "Launch Successful",
    pill: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  5: {
    label: "Launch Failure",
    pill: "border-red-400/25 bg-red-400/10 text-red-300",
    dot: "bg-red-400",
  },
  6: {
    label: "In Flight",
    pill: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    dot: "bg-cyan-400 animate-pulse",
  },
  7: {
    label: "Partial Failure",
    pill: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
  8: {
    label: "Hold",
    pill: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
};
const getStatus = (id) => STATUS_MAP[id] || STATUS_MAP[2];

const fmtDate = (iso) => {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

const getLaunchImage = (launch) => {
  if (!launch?.image) return "";
  if (typeof launch.image === "string") return launch.image;
  return launch.image.image_url || launch.image.thumbnail_url || "";
};

const Stat = ({ label, value, mono = false }) =>
  value ? (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-medium text-white ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  ) : null;

const Section = ({ title, children }) => (
  <div>
    <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-zinc-600">
      {title}
    </h2>
    {children}
  </div>
);

const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-72 rounded-3xl bg-white/5 sm:h-96" />
    <div className="h-8 w-2/3 rounded bg-white/5" />
    <div className="h-4 w-1/3 rounded bg-white/4" />
    <div className="grid gap-3 sm:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-white/4" />
      ))}
    </div>
  </div>
);

export default function LaunchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError(null);
    setImgFailed(false);
    (async () => {
      try {
        const res = await getGlobalLaunchById(id);
        if (!live) return;
        setLaunch(res.data);
      } catch {
        if (!live) return;
        setError("Failed to load launch data. It may no longer exist.");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [id]);

  const st = launch ? getStatus(launch.status?.id) : null;
  const vidUrls = launch?.vidURLs || [];
  const primaryVideo = vidUrls[0]?.url || (launch?.webcast_live ? null : null);
  const imageUrl = getLaunchImage(launch);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute -right-40 top-1/3 h-[350px] w-[350px] rounded-full bg-zinc-600/5 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:px-10 lg:px-16">
        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-white"
        >
          <svg
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Launches
        </button>

        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/5 p-12 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <Link
              to="/launches"
              className="mt-4 inline-block text-xs text-zinc-500 hover:text-white transition-colors"
            >
              ← Return to launches
            </Link>
          </div>
        ) : !launch ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/5 p-12 text-center">
            <p className="text-sm text-red-400">Launch not found.</p>
            <Link to="/launches" className="mt-4 inline-block text-xs text-zinc-500 hover:text-white transition-colors">
              ← Return to launches
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* hero image */}
            <div className="relative h-64 overflow-hidden rounded-3xl bg-zinc-900 sm:h-96">
              {imageUrl && !imgFailed ? (
                <img
                  src={imageUrl}
                  alt={launch.name}
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-8xl opacity-10">🚀</span>
                </div>
              )}
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* live badge */}
              {launch.webcast_live && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-cyan-300 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                  Live Webcast
                </div>
              )}
              {/* mission patch */}
              {launch.mission_patches?.[0]?.image_url && (
                <img
                  src={launch.mission_patches[0].image_url}
                  alt="Mission patch"
                  className="absolute bottom-4 right-4 h-16 w-16 rounded-full border border-white/15 bg-black/50 object-contain p-1"
                />
              )}
            </div>

            {/* title + status */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {st && (
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${st.pill}`}
                    >
                      <span
                        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${st.dot}`}
                      />
                      {st.label}
                    </span>
                  )}
                  {launch.launch_service_provider?.abbrev && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                      {launch.launch_service_provider.abbrev}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-light tracking-[-0.04em] text-white sm:text-4xl">
                  {launch.name}
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  {launch.launch_service_provider?.name}
                </p>
              </div>
              {/* webcast button */}
              {primaryVideo && (
                <a
                  href={primaryVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Webcast
                </a>
              )}
            </div>

            {/* key stats grid */}
            <Section title="Mission Details">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Stat label="Launch Date" value={fmtDate(launch.net)} mono />
                <Stat
                  label="Rocket"
                  value={
                    launch.rocket?.configuration?.full_name ||
                    launch.rocket?.configuration?.name
                  }
                />
                <Stat label="Mission Type" value={launch.mission?.type} />
                <Stat
                  label="Target Orbit"
                  value={launch.mission?.orbit?.name}
                />
                <Stat label="Launch Pad" value={launch.pad?.name} />
                <Stat label="Location" value={launch.pad?.location?.name} />
              </div>
            </Section>

            {/* mission description */}
            {launch.mission?.description && (
              <Section title="Mission Brief">
                <p className="text-sm leading-7 text-zinc-400">
                  {launch.mission.description}
                </p>
              </Section>
            )}

            {/* rocket details */}
            {launch.rocket?.configuration && (
              <Section title="Vehicle">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat
                    label="Family"
                    value={launch.rocket.configuration.family}
                  />
                  <Stat
                    label="Variant"
                    value={launch.rocket.configuration.variant}
                  />
                  <Stat
                    label="Total Launches"
                    value={launch.rocket.configuration.total_launch_count}
                  />
                  <Stat
                    label="Successful Launches"
                    value={launch.rocket.configuration.successful_launches}
                  />
                </div>
              </Section>
            )}

            {/* launch pad details */}
            {(launch.pad?.latitude || launch.pad?.total_launch_count) && (
              <Section title="Launch Site">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Stat label="Pad Name" value={launch.pad?.name} />
                  <Stat
                    label="Total Launches"
                    value={launch.pad?.total_launch_count}
                  />
                  {launch.pad?.latitude && launch.pad?.longitude && (
                    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600">
                        Coordinates
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${launch.pad.latitude},${launch.pad.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {parseFloat(launch.pad.latitude).toFixed(4)}°,{" "}
                        {parseFloat(launch.pad.longitude).toFixed(4)}°
                      </a>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* all webcasts */}
            {vidUrls.length > 1 && (
              <Section title="Webcast Links">
                <div className="flex flex-wrap gap-3">
                  {vidUrls.map((v, i) => (
                    <a
                      key={i}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-cyan-400/30 hover:text-cyan-300"
                    >
                      {v.title || `Stream ${i + 1}`}
                    </a>
                  ))}
                </div>
              </Section>
            )}

            {/* attribution */}
            <p className="text-center text-[10px] text-zinc-800">
              Data from{" "}
              <a
                href="https://thespacedevs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-600 transition-colors"
              >
                The Space Devs — Launch Library 2
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
