import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getGlobalUpcomingLaunches,
  getGlobalPreviousLaunches,
} from "../api/space";

const STATUS_MAP = {
  1: {
    label: "Go",
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
    label: "Success",
    pill: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  5: {
    label: "Failure",
    pill: "border-red-400/25 bg-red-400/10 text-red-300",
    dot: "bg-red-400",
  },
  6: {
    label: "In Flight",
    pill: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    dot: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse",
  },
  7: {
    label: "Partial",
    pill: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
  8: {
    label: "Hold",
    pill: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },
};
const AGENCIES = [
  "All",
  "NASA",
  "SpaceX",
  "ESA",
  "ISRO",
  "CNSA",
  "Roscosmos",
  "ULA",
  "Rocket Lab",
];
const getStatus = (id) => STATUS_MAP[id] || STATUS_MAP[2];

const fmtDate = (iso) => {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const trim = (s, n) => (s && s.length > n ? s.slice(0, n) + "…" : s || "—");

const getLaunchImage = (launch) => {
  if (!launch?.image) return "";
  if (typeof launch.image === "string") return launch.image;
  return launch.image.image_url || launch.image.thumbnail_url || "";
};

const Skeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-white/8 bg-zinc-950">
    <div className="h-44 animate-pulse bg-white/5" />
    <div className="space-y-3 p-5">
      <div className="flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-white/6" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-white/6" />
      </div>
      <div className="h-5 w-3/4 animate-pulse rounded bg-white/6" />
      <div className="h-3 w-full animate-pulse rounded bg-white/4" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-white/4" />
    </div>
  </div>
);

const LaunchCard = ({ launch }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const st = getStatus(launch.status?.id);
  const agency = launch.launch_service_provider?.name || "Unknown";
  const agencyAbbr =
    launch.launch_service_provider?.abbrev || agency.slice(0, 4);
  const rocket =
    launch.rocket?.configuration?.full_name ||
    launch.rocket?.configuration?.name ||
    "—";
  const missionType = launch.mission?.type || "—";
  const orbit = launch.mission?.orbit?.name || "";
  const pad = launch.pad?.name || "TBD";
  const location = trim(launch.pad?.location?.name || "", 28);
  const date = fmtDate(launch.net);
  const hasWebcast = launch.webcast_live || launch.vidURLs?.length > 0;
  const imageUrl = getLaunchImage(launch);

  return (
    <Link
      to={`/launches/${launch.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-zinc-950 transition-all duration-300 hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_24px_50px_rgba(0,0,0,0.55)]"
    >
      {/* image */}
      <div className="relative h-44 overflow-hidden bg-zinc-900 flex-shrink-0">
        {imageUrl && !imgFailed ? (
          <img
            src={imageUrl}
            alt={launch.name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-black">
            <span className="text-5xl opacity-20">🚀</span>
          </div>
        )}
        {/* top shimmer on hover */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* live badge */}
        {hasWebcast && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-black/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-cyan-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Live
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* status + agency */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] ${st.pill}`}
          >
            {st.label}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-zinc-400">
            {agencyAbbr}
          </span>
          {orbit && (
            <span className="rounded-full border border-white/8 bg-white/3 px-2.5 py-0.5 text-[9px] text-zinc-600">
              {trim(orbit, 18)}
            </span>
          )}
        </div>

        {/* mission name */}
        <h3 className="text-base font-semibold leading-snug text-white">
          {trim(launch.name, 52)}
        </h3>

        {/* rocket */}
        <p className="text-xs text-zinc-500">
          {rocket} · <span className="text-zinc-600">{agency}</span>
        </p>

        {/* description */}
        {launch.mission?.description && (
          <p className="text-xs leading-5 text-zinc-700 line-clamp-2">
            {launch.mission.description}
          </p>
        )}

        {/* divider */}
        <div className="mt-auto h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

        {/* date + pad */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="font-mono text-xs font-semibold text-white">{date}</p>
            <p className="mt-0.5 text-[10px] text-zinc-600">{pad}</p>
            {location && <p className="text-[9px] text-zinc-700">{location}</p>}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            <span className="text-[9px] uppercase tracking-widest text-zinc-600">
              {launch.status?.name || "—"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Launches() {
  const [tab, setTab] = useState("upcoming");
  const [agency, setAgency] = useState("All");
  const [data, setData] = useState({
    upcoming: [],
    previous: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let live = true;
    (async () => {
      const [upR, prevR] = await Promise.allSettled([
        getGlobalUpcomingLaunches(40),
        getGlobalPreviousLaunches(40),
      ]);
      if (!live) return;
      setData({
        upcoming:
          upR.status === "fulfilled" ? upR.value.data?.results || [] : [],
        previous:
          prevR.status === "fulfilled" ? prevR.value.data?.results || [] : [],
        loading: false,
        error:
          upR.status === "rejected" && prevR.status === "rejected"
            ? "Failed to load launches"
            : null,
      });
    })();
    return () => {
      live = false;
    };
  }, []);

  const pool = tab === "upcoming" ? data.upcoming : data.previous;
  const filtered =
    agency === "All"
      ? pool
      : pool.filter((l) =>
          l.launch_service_provider?.name
            ?.toLowerCase()
            .includes(agency.toLowerCase()),
        );

  const counts = {};
  AGENCIES.forEach((a) => {
    counts[a] =
      a === "All"
        ? pool.length
        : pool.filter((l) =>
            l.launch_service_provider?.name
              ?.toLowerCase()
              .includes(a.toLowerCase()),
          ).length;
  });

  return (
    <>
      <main className="relative min-h-screen overflow-hidden">
        {/* ambient glows */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[110px]" />
          <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-zinc-600/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16 xl:px-20">
          {/* header */}
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-700">
              Global mission tracker
            </p>
            <h1 className="mt-3 text-4xl font-light tracking-[-0.05em] text-white sm:text-5xl">
              All agencies.
              <br />
              <span className="text-zinc-600">Every launch.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-500">
              SpaceX, NASA, ESA, ISRO, and beyond — every orbital launch from
              every agency, live via Launch Library 2.
            </p>
          </div>

          {/* tab toggle */}
          <div className="mb-6 flex items-center gap-3">
            {["upcoming", "previous"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full border px-5 py-2 text-sm font-medium capitalize transition-all ${
                  tab === t
                    ? "border-white/20 bg-white text-zinc-950"
                    : "border-white/8 bg-white/4 text-zinc-400 hover:bg-white/8 hover:text-white"
                }`}
              >
                {t}{" "}
                {!data.loading && (
                  <span className="ml-1 text-xs opacity-60">
                    (
                    {tab === t
                      ? filtered.length
                      : (t === "upcoming" ? data.upcoming : data.previous)
                          .length}
                    )
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* agency filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {AGENCIES.map((a) => (
              <button
                key={a}
                onClick={() => setAgency(a)}
                className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-all ${
                  agency === a
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/8 bg-white/3 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
                }`}
              >
                {a}
                {!data.loading && counts[a] > 0 && (
                  <span className="ml-1.5 opacity-50">{counts[a]}</span>
                )}
              </button>
            ))}
          </div>

          {/* grid */}
          {data.loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : data.error ? (
            <div className="rounded-3xl border border-red-400/15 bg-red-400/5 p-8 text-center">
              <p className="text-sm text-red-400">{data.error}</p>
              <p className="mt-1 text-xs text-zinc-600">
                Launch Library 2 may be rate-limiting. Try again in a minute.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/6 bg-white/3 p-12 text-center">
              <p className="text-sm text-zinc-500">
                No {tab} launches found for{" "}
                <span className="text-white">{agency}</span>
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => (
                <LaunchCard key={l.id} launch={l} />
              ))}
            </div>
          )}

          {/* attribution */}
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
