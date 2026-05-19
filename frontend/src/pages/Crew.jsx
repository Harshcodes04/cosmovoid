import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAstronauts } from "../api/space";

const SKELETON_COUNT = 8;
const FILTERS = ["All", "Active", "In Space", "Retired"];

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
  getImageUrl(astronaut.profile_image) ||
  getImageUrl(astronaut.profile_image_thumbnail) ||
  getImageUrl(astronaut.image);

const Skeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-white/8 bg-zinc-950">
    <div className="h-64 animate-pulse bg-white/5" />
    <div className="space-y-3 p-5">
      <div className="flex justify-between items-center">
        <div className="h-5 w-32 animate-pulse rounded bg-white/6" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-white/6" />
      </div>
      <div className="h-4 w-24 animate-pulse rounded bg-white/6" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-white/6" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-white/6" />
      </div>
    </div>
  </div>
);

const AstronautCard = ({ astronaut: rawAstronaut }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const astronaut = {
    ...rawAstronaut,
    nationality: getNationalityLabel(rawAstronaut.nationality),
  };
  const profileImage = getAstronautImage(astronaut);

  const statusColors = {
    Active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Retired: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
    Deceased: "border-zinc-700/50 bg-zinc-800/50 text-zinc-500",
    "In Training": "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  };

  const statusName = astronaut.status?.name || "Unknown";
  const statusClass =
    statusColors[statusName] || "border-white/10 bg-white/5 text-zinc-300";
  const agencyAbbr = astronaut.agency?.abbrev || "—";

  return (
    <Link
      to={`/crew/${astronaut.id}`}
      state={{ astronaut }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_24px_50px_rgba(0,0,0,0.5)]"
    >
      {/* image */}
      <div className="relative h-64 overflow-hidden bg-zinc-900 flex-shrink-0">
        {profileImage && !imgFailed ? (
          <img
            src={profileImage}
            alt={astronaut.name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
            <span className="text-5xl opacity-20">🧑‍🚀</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 to-transparent" />

        {astronaut.in_space && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-black/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-cyan-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            In Space
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 p-5 pt-2 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-snug text-white">
            {astronaut.name}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-widest ${statusClass}`}
          >
            {statusName}
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          <span className="text-zinc-300">{agencyAbbr}</span>
          {astronaut.nationality && ` · ${astronaut.nationality}`}
        </p>

        {astronaut.bio && (
          <p className="mt-2 text-xs leading-5 text-zinc-500 line-clamp-3">
            {astronaut.bio}
          </p>
        )}

        <div className="mt-auto pt-4 flex gap-3 text-[10px] text-zinc-600 font-mono">
          {astronaut.flights_count > 0 && (
            <span>FLIGHTS: {astronaut.flights_count}</span>
          )}
          {astronaut.spacewalks_count > 0 && (
            <span>EVA: {astronaut.spacewalks_count}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default function Crew() {
  const [filter, setFilter] = useState("All");
  const [data, setData] = useState({
    astronauts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let live = true;
    setData((prev) => ({ ...prev, loading: true }));
    (async () => {
      try {
        const res = await getAstronauts({ limit: 80 });
        if (!live) return;
        setData({
          astronauts: res.data?.results || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!live) return;
        setData({
          astronauts: [],
          loading: false,
          error:
            err?.response?.status === 429
              ? "Astronaut data is temporarily rate-limited"
              : "Failed to load astronauts",
        });
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const visibleAstronauts = data.astronauts.filter((astronaut) => {
    if (filter === "In Space") return astronaut.in_space;
    if (filter === "Active") return astronaut.status?.name === "Active";
    if (filter === "Retired") return astronaut.status?.name === "Retired";
    return true;
  });

  return (
    <>
      <main className="relative min-h-screen overflow-hidden">
        {/* ambient glows */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
          <div className="absolute -right-20 top-1/2 h-[400px] w-[400px] rounded-full bg-zinc-500/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16 xl:px-20">
          {/* header */}
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-700">
              Global Astronaut Registry
            </p>
            <h1 className="mt-3 text-4xl font-light tracking-[-0.05em] text-white sm:text-5xl">
              The humans
              <br />
              <span className="text-zinc-600">among the stars.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-500">
              Profiles, mission histories, and real-time status of astronauts
              across all global space agencies.
            </p>
          </div>

          {/* filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                  filter === f
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/8 bg-white/3 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* grid */}
          {data.loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(SKELETON_COUNT)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : data.error ? (
            <div className="rounded-3xl border border-red-400/15 bg-red-400/5 p-8 text-center">
              <p className="text-sm text-red-400">{data.error}</p>
              <p className="mt-1 text-xs text-zinc-600">
                Please try again later.
              </p>
            </div>
          ) : visibleAstronauts.length === 0 ? (
            <div className="rounded-3xl border border-white/6 bg-white/3 p-12 text-center">
              <p className="text-sm text-zinc-500">
                No astronauts found for{" "}
                <span className="text-white">{filter}</span>
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleAstronauts.map((a) => (
                <AstronautCard key={a.id} astronaut={a} />
              ))}
            </div>
          )}

          <p className="mt-10 text-center text-[10px] text-zinc-800">
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
      </main>
    </>
  );
}
