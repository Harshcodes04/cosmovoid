import { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { getAstronautById } from "../api/space";

/* ── Stat tile ────────────────────────────────────────────── */
const Stat = ({ label, value, mono = false }) =>
  value != null && value !== "" && value !== 0 ? (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600">{label}</p>
      <p className={`mt-1 text-sm font-medium text-white ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  ) : null;

/* ── Section heading ──────────────────────────────────────── */
const Section = ({ title, children }) => (
  <div>
    <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-zinc-600">{title}</h2>
    {children}
  </div>
);

/* ── Status color map ─────────────────────────────────────── */
const statusColors = {
  Active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Retired: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  Deceased: "border-zinc-700/50 bg-zinc-800/50 text-zinc-500",
  "In Training": "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
};

/* ── Skeleton ─────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="h-52 w-52 shrink-0 rounded-full bg-white/5" />
      <div className="flex-1 space-y-4 w-full">
        <div className="h-8 w-1/2 rounded bg-white/5" />
        <div className="h-4 w-1/3 rounded bg-white/4" />
        <div className="h-4 w-2/3 rounded bg-white/4" />
        <div className="grid gap-3 sm:grid-cols-3 mt-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/4" />)}
        </div>
      </div>
    </div>
  </div>
);

const fmtDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const getNationalityLabel = (nationality) => {
  if (!nationality) return "";
  if (typeof nationality === "string") return nationality.split(",")[0].trim();
  if (Array.isArray(nationality)) return getNationalityLabel(nationality[0]);

  return (
    nationality.nationality_name ||
    nationality.name ||
    nationality.abbrev ||
    ""
  );
};

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (Array.isArray(image)) return getImageUrl(image[0]);

  return (
    image.image_url ||
    image.thumbnail_url ||
    image.url ||
    image.src ||
    ""
  );
};

const getAstronautImage = (astronaut) =>
  getImageUrl(astronaut?.profile_image) ||
  getImageUrl(astronaut?.profile_image_thumbnail) ||
  getImageUrl(astronaut?.image);

const normalizeAstronaut = (astronaut) =>
  astronaut
    ? {
        ...astronaut,
        nationality: getNationalityLabel(astronaut.nationality),
      }
    : null;

export default function CrewDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fallbackAstronaut = normalizeAstronaut(location.state?.astronaut);
  const [astronaut, setAstronaut] = useState(fallbackAstronaut);
  const [loading, setLoading] = useState(!fallbackAstronaut);
  const [error, setError] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(!fallbackAstronaut);
    setError(null);
    setImgFailed(false);
    (async () => {
      try {
        const res = await getAstronautById(id);
        if (!live) return;
        setAstronaut(normalizeAstronaut(res.data));
      } catch (err) {
        if (!live) return;
        if (fallbackAstronaut) {
          setAstronaut(fallbackAstronaut);
          setError(null);
        } else {
          setError(
            err?.response?.status === 429
              ? "Astronaut data is temporarily rate-limited."
              : "Failed to load astronaut data.",
          );
        }
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [id]);

  const statusName = astronaut?.status?.name || "Unknown";
  const statusClass = statusColors[statusName] || "border-white/10 bg-white/5 text-zinc-300";
  const profileImage = getAstronautImage(astronaut);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute -right-40 top-1/2 h-[350px] w-[350px] rounded-full bg-zinc-600/5 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:px-10 lg:px-16">
        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-white"
        >
          <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Crew
        </button>

        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/5 p-12 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <Link to="/crew" className="mt-4 inline-block text-xs text-zinc-500 hover:text-white transition-colors">
              ← Return to crew
            </Link>
          </div>
        ) : !astronaut ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/5 p-12 text-center">
            <p className="text-sm text-red-400">Astronaut not found.</p>
            <Link to="/crew" className="mt-4 inline-block text-xs text-zinc-500 hover:text-white transition-colors">
              ← Return to crew
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* hero section */}
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              {/* profile image */}
              <div className="relative shrink-0">
                <div className="h-52 w-52 overflow-hidden rounded-full border-2 border-white/10 bg-zinc-900">
                  {profileImage && !imgFailed ? (
                    <img
                      src={profileImage}
                      alt={astronaut.name}
                      onError={() => setImgFailed(true)}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-6xl opacity-20">🧑‍🚀</span>
                    </div>
                  )}
                </div>
                {/* in space badge */}
                {astronaut.in_space && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-black/80 px-3 py-1 text-[9px] font-medium uppercase tracking-widest text-cyan-300 backdrop-blur-sm whitespace-nowrap">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                    Currently in Space
                  </div>
                )}
              </div>

              {/* name + bio header */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:justify-start">
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${statusClass}`}>
                    {statusName}
                  </span>
                  {astronaut.agency?.abbrev && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                      {astronaut.agency.abbrev}
                    </span>
                  )}
                  {astronaut.nationality && (
                    <span className="rounded-full border border-white/8 bg-white/3 px-3 py-1 text-[10px] text-zinc-600">
                      {astronaut.nationality}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-light tracking-[-0.04em] text-white sm:text-4xl">
                  {astronaut.name}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {astronaut.agency?.name}
                  {astronaut.type?.name && <span className="text-zinc-700"> · {astronaut.type.name}</span>}
                </p>

                {/* quick stats row */}
                <div className="mt-5 flex flex-wrap justify-center gap-5 sm:justify-start">
                  {astronaut.flights_count > 0 && (
                    <div className="text-center">
                      <p className="text-xl font-semibold text-white">{astronaut.flights_count}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Flights</p>
                    </div>
                  )}
                  {astronaut.spacewalks_count > 0 && (
                    <div className="text-center">
                      <p className="text-xl font-semibold text-white">{astronaut.spacewalks_count}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">EVAs</p>
                    </div>
                  )}
                  {astronaut.time_in_space && (
                    <div className="text-center">
                      <p className="text-xl font-semibold text-white font-mono">{astronaut.time_in_space.split(" ")[0]}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Days in Space</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* biography */}
            {astronaut.bio && (
              <Section title="Biography">
                <p className="text-sm leading-7 text-zinc-400">{astronaut.bio}</p>
              </Section>
            )}

            {/* personal details */}
            <Section title="Personal Details">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Stat label="Date of Birth" value={fmtDate(astronaut.date_of_birth)} />
                <Stat label="Nationality" value={astronaut.nationality} />
                <Stat label="Date of Death" value={fmtDate(astronaut.date_of_death)} />
                <Stat label="First Flight" value={fmtDate(astronaut.first_flight)} />
                <Stat label="Last Flight" value={fmtDate(astronaut.last_flight)} />
                <Stat label="Total EVA Time" value={astronaut.eva_time} mono />
              </div>
            </Section>

            {/* flights list */}
            {astronaut.flights?.length > 0 && (
              <Section title={`Missions (${astronaut.flights.length})`}>
                <div className="space-y-2">
                  {astronaut.flights.map((f) => (
                    <Link
                      key={f.id}
                      to={`/launches/${f.id}`}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/3 px-5 py-3.5 text-sm transition-colors hover:border-white/15 hover:bg-white/5"
                    >
                      <span className="text-zinc-300">{f.name}</span>
                      <span className="text-[10px] font-mono text-zinc-600">
                        {fmtDate(f.net) || "—"}
                      </span>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {/* spacewalks list */}
            {astronaut.spacewalks?.length > 0 && (
              <Section title={`Spacewalks (${astronaut.spacewalks.length})`}>
                <div className="space-y-2">
                  {astronaut.spacewalks.map((sw, i) => (
                    <div key={i} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/3 px-5 py-3.5">
                      <span className="text-sm text-zinc-300">{sw.name || `EVA ${i + 1}`}</span>
                      <span className="text-[10px] font-mono text-zinc-600">{sw.duration || "—"}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* external link */}
            {astronaut.wiki && (
              <div className="flex justify-center">
                <a
                  href={astronaut.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  View on Wikipedia →
                </a>
              </div>
            )}

            {/* attribution */}
            <p className="text-center text-[10px] text-zinc-800">
              Data from{" "}
              <a href="https://thespacedevs.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600 transition-colors">
                The Space Devs — Launch Library 2
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
