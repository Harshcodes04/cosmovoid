import { useEffect, useMemo, useState } from "react";
import { getSkyEvents } from "../api/space";

const TYPE_META = {
  meteor_shower: {
    label: "Meteor Shower",
    color: "text-cyan-300",
    bg: "bg-cyan-300/10 border-cyan-300/20",
    dot: "bg-cyan-400",
  },
  planet: {
    label: "Planetary Event",
    color: "text-amber-300",
    bg: "bg-amber-300/10 border-amber-300/20",
    dot: "bg-amber-400",
  },
  eclipse: {
    label: "Eclipse",
    color: "text-red-300",
    bg: "bg-red-400/10 border-red-400/20",
    dot: "bg-red-400",
  },
  solstice: {
    label: "Solstice / Equinox",
    color: "text-violet-300",
    bg: "bg-violet-400/10 border-violet-400/20",
    dot: "bg-violet-400",
  },
  conjunction: {
    label: "Conjunction",
    color: "text-emerald-300",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    dot: "bg-emerald-400",
  },
};

const FILTERS = [
  { key: "all", label: "All events" },
  { key: "meteor_shower", label: "Meteor Showers" },
  { key: "planet", label: "Planetary" },
  { key: "solstice", label: "Solstice / Equinox" },
  { key: "eclipse", label: "Eclipse" },
];

const formatDate = (iso) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

const formatMonth = (iso) =>
  new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(iso));

const formatDay = (iso) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric" }).format(new Date(iso));

const countdown = (peakIso) => {
  const diff = new Date(peakIso) - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h away`;
  return `${hours}h away`;
};

const StarRating = ({ rating }) => {
  const filled = (rating || "").split("★").length - 1;
  return (
    <span className="text-xs tracking-wider text-amber-400">
      {"★".repeat(filled)}
      <span className="text-zinc-700">{"★".repeat(5 - filled)}</span>
    </span>
  );
};

const EventCard = ({ event, onClick }) => {
  const meta = TYPE_META[event.type] || TYPE_META.meteor_shower;
  const timer = countdown(event.peak);

  return (
    <button
      type="button"
      onClick={() => onClick(event)}
      className="group w-full overflow-hidden rounded-[1.5rem] border border-white/8 bg-zinc-950/70 text-left shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-white/14 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
    >
      <div className="flex gap-0">
        {/* date column */}
        <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 border-r border-white/8 py-5 px-3">
          <span className="text-[10px] uppercase tracking-widest text-zinc-600">
            {formatMonth(event.date)}
          </span>
          <span className="font-mono text-3xl font-light text-white leading-none">
            {formatDay(event.date)}
          </span>
          {timer && (
            <span
              className={`mt-2 rounded-full px-2 py-0.5 text-[9px] font-medium border ${meta.bg} ${meta.color}`}
            >
              {timer}
            </span>
          )}
        </div>

        {/* content */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${meta.bg} ${meta.color}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            <StarRating rating={event.magnitude} />
          </div>

          <h2 className="text-base font-semibold leading-snug text-white sm:text-lg">
            {event.title}
          </h2>

          {event.rate && (
            <p className="text-xs text-zinc-400">
              <span className={`font-semibold ${meta.color}`}>
                {event.rate}
              </span>
              {event.duration && ` · ${event.duration}`}
            </p>
          )}

          <p className="line-clamp-2 text-sm leading-6 text-zinc-500">
            {event.description}
          </p>

          <p className="text-xs text-zinc-600">📍 {event.visibility}</p>
        </div>

        <div className="flex items-center pr-4 text-zinc-700 transition-colors group-hover:text-zinc-400">
          →
        </div>
      </div>
    </button>
  );
};

const DetailModal = ({ event, onClose }) => {
  if (!event) return null;
  const meta = TYPE_META[event.type] || TYPE_META.meteor_shower;
  const timer = countdown(event.peak);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-zinc-300 transition-colors hover:bg-white/12"
          aria-label="Close"
        >
          ✕
        </button>

        {/* header band */}
        <div className={`border-b border-white/8 px-6 py-5 pr-14 ${meta.bg}`}>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
            <span
              className={`text-[10px] font-semibold uppercase tracking-widest ${meta.color}`}
            >
              {meta.label}
            </span>
            {timer && (
              <span className={`ml-auto text-xs font-medium ${meta.color}`}>
                {timer}
              </span>
            )}
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {event.title}
          </h2>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-zinc-400">
              {formatDate(event.date)}
            </span>
            {event.time && (
              <span className="text-sm text-zinc-600">
                · {event.time} local
              </span>
            )}
            <StarRating rating={event.magnitude} />
          </div>
        </div>

        {/* details */}
        <div className="space-y-5 p-6">
          <p className="text-sm leading-7 text-zinc-300">{event.description}</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                Where to look
              </p>
              <p className="mt-1 text-sm text-zinc-200">{event.direction}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                Visibility
              </p>
              <p className="mt-1 text-sm text-zinc-200">{event.visibility}</p>
            </div>
            {event.rate && (
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Peak rate
                </p>
                <p className={`mt-1 text-sm font-semibold ${meta.color}`}>
                  {event.rate}
                </p>
              </div>
            )}
            {event.duration && (
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Duration
                </p>
                <p className="mt-1 text-sm text-zinc-200">{event.duration}</p>
              </div>
            )}
          </div>

          {event.tips && (
            <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] p-4">
              <p className="text-[10px] uppercase tracking-widest text-cyan-600">
                Viewing tip
              </p>
              <p className="mt-1 text-sm text-zinc-300">{event.tips}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Skeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="h-28 animate-pulse rounded-[1.5rem] border border-white/8 bg-white/[0.04]"
        style={{ animationDelay: `${i * 60}ms` }}
      />
    ))}
  </div>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    getSkyEvents()
      .then((res) => {
        if (active) setEvents(res.data || []);
      })
      .catch(() => {
        if (active) setError("Could not load sky events right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.type === filter)),
    [events, filter],
  );

  const nextEvent = events[0];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden"></div>

      <section className="relative mx-auto max-w-4xl">
        {/* header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-light leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            What's happening
            <br />
            <span className="text-zinc-500">up there.</span>
          </h1>
          <p className="max-w-xl text-sm leading-7 text-zinc-400">
            Meteor showers, planetary alignments, solstices — everything worth
            stepping outside for. Times are approximate; check a sky app for
            your exact local window.
          </p>
        </div>

        {/* next event spotlight */}
        {!loading &&
          nextEvent &&
          (() => {
            const meta = TYPE_META[nextEvent.type] || TYPE_META.meteor_shower;
            const timer = countdown(nextEvent.peak);
            return (
              <button
                type="button"
                onClick={() => setSelected(nextEvent)}
                className={`mb-8 w-full overflow-hidden rounded-[1.5rem] border text-left ${meta.bg} transition-all hover:brightness-110`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
                  <div className="space-y-1">
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-widest ${meta.color}`}
                    >
                      Next event
                    </p>
                    <h2 className="text-xl font-semibold text-white">
                      {nextEvent.title}
                    </h2>
                    <p className="text-sm text-zinc-400">
                      {formatDate(nextEvent.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    {timer && (
                      <p
                        className={`font-mono text-2xl font-light ${meta.color}`}
                      >
                        {timer}
                      </p>
                    )}
                    <StarRating rating={nextEvent.magnitude} />
                  </div>
                </div>
              </button>
            );
          })()}

        {/* filter pills */}
        {!loading && (
          <div className="mb-5 flex flex-wrap gap-2">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  filter === key
                    ? "border-violet-400/35 bg-violet-400/12 text-violet-100"
                    : "border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/8 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto self-center text-xs text-zinc-600">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4 text-sm text-amber-200">
            {error}
          </div>
        )}

        {loading ? (
          <Skeleton />
        ) : filtered.length ? (
          <div className="space-y-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} onClick={setSelected} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-zinc-600">
            No events match this filter right now.
          </div>
        )}
      </section>

      <DetailModal event={selected} onClose={() => setSelected(null)} />
    </main>
  );
};

export default Events;
