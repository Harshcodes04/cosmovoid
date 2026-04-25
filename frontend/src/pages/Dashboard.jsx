import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/useAuth";
import {
  getApod,
  getAsteroids,
  getJournalEntries,
  getLatestLaunch,
  getNews,
  getUpcomingLaunches,
} from "../api/space";

const quickLinks = [
  { label: "Launches", to: "/launches", copy: "Track the next missions" },
  { label: "News", to: "/news", copy: "Catch today's space headlines" },
  { label: "Gallery", to: "/gallery", copy: "Browse NASA visuals" },
  { label: "Crew", to: "/crew", copy: "Meet the people in orbit" },
  { label: "Events", to: "/events", copy: "See what's happening above Earth" },
  { label: "Search", to: "/search", copy: "Find images and media fast" },
];

const formatDate = (value, options = {}) => {
  if (!value) return "Not available yet";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(value));
};

const trimText = (value, limit) => {
  if (!value) return "";
  if (value.length <= limit) return value;
  return `${value.slice(0, limit).trim()}...`;
};

const pickNextLaunch = (launches = []) => {
  return [...launches]
    .sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc))
    .find((launch) => new Date(launch.date_utc) >= new Date());
};

const getAsteroidWatchlist = (payload) => {
  const byDate = payload?.near_earth_objects;

  if (!byDate) return [];

  const [firstDate] = Object.keys(byDate);
  return byDate[firstDate] || [];
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState({
    apod: null,
    latestLaunch: null,
    nextLaunch: null,
    news: [],
    asteroidWatchlist: [],
    journalEntries: [],
  });

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        getApod(),
        getLatestLaunch(),
        getUpcomingLaunches(),
        getNews(),
        getAsteroids(),
        getJournalEntries(),
      ]);

      if (!active) return;

      const [
        apodResult,
        latestLaunchResult,
        upcomingLaunchesResult,
        newsResult,
        asteroidsResult,
        journalResult,
      ] = results;

      const nextLaunch =
        upcomingLaunchesResult.status === "fulfilled"
          ? pickNextLaunch(upcomingLaunchesResult.value.data)
          : null;

      setSnapshot({
        apod: apodResult.status === "fulfilled" ? apodResult.value.data : null,
        latestLaunch:
          latestLaunchResult.status === "fulfilled"
            ? latestLaunchResult.value.data
            : null,
        nextLaunch,
        news:
          newsResult.status === "fulfilled"
            ? newsResult.value.data?.results || []
            : [],
        asteroidWatchlist:
          asteroidsResult.status === "fulfilled"
            ? getAsteroidWatchlist(asteroidsResult.value.data)
            : [],
        journalEntries:
          journalResult.status === "fulfilled"
            ? journalResult.value.data?.entries || []
            : [],
      });

      const failedCount = results.filter(
        (result) => result.status === "rejected",
      ).length;

      if (failedCount === results.length) {
        setError("Mission control could not load your dashboard right now.");
      } else if (failedCount > 0) {
        setError("Some dashboard panels are temporarily offline.");
      }

      setLoading(false);
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.username || "Explorer";
  const journalEntries = snapshot.journalEntries.slice(0, 4);
  const newsItems = snapshot.news.slice(0, 3);
  const asteroidWatchlist = snapshot.asteroidWatchlist.slice(0, 3);
  const dashboardRail = (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,10,22,0.98)_0%,rgba(17,24,39,0.96)_100%)] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
      <section className="rounded-[1.6rem] border border-cyan-300/14 bg-cyan-300/8 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/75">
          Pilot profile
        </p>
        <h2 className="mt-3 text-2xl font-medium text-white">
          {user?.username || "Explorer"}
        </h2>
        <p className="mt-2 text-sm text-zinc-200">
          Signed in and ready to keep building your personal record of the
          cosmos.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
              Your journal
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">
              Recent entries
            </h2>
          </div>
          <Link
            to="/journal"
            className="text-sm font-medium text-cyan-200 transition-colors hover:text-white"
          >
            See all
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="rounded-[1.4rem] border border-white/10 bg-black/16 p-5 text-sm text-zinc-300">
              Loading your journal rail...
            </div>
          ) : journalEntries.length ? (
            journalEntries.map((entry) => (
              <Link
                key={entry._id}
                to={`/journal/${entry._id}`}
                className="block rounded-[1.4rem] border border-white/10 bg-black/18 p-4 transition-colors hover:border-cyan-200/20 hover:bg-white/6"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">
                    {entry.title}
                  </p>
                  {entry.mood ? (
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                      {entry.mood}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {trimText(entry.content, 110)}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {formatDate(entry.createdAt)}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-black/12 p-5 text-sm text-zinc-300">
              Your previous entries will show up here. Start one and it will
              become part of this rail.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3">
        <Link
          to="/journal"
          className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
        >
          Go to my journal section
        </Link>
        <Link
          to="/journal/new"
          className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
        >
          Write a new entry
        </Link>
      </section>
    </div>
  );

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="relative overflow-x-hidden px-6 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="cosmos-nebula absolute left-[-8%] top-14 h-72 w-72 rounded-full bg-cyan-400/14 blur-3xl" />
          <div className="cosmos-drift absolute right-[-10%] top-28 h-[26rem] w-[26rem] rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/8 blur-3xl" />
        </div>

        <section className="relative mx-auto grid max-w-7xl gap-8 xl:gap-12 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(12,19,45,0.96)_0%,rgba(24,32,73,0.94)_48%,rgba(10,12,24,0.96)_100%)] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)] sm:p-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <p className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-cyan-100">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]" />
                    Personal Mission Control
                  </p>
                  <div className="space-y-3">
                    <h1 className="text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl">
                      Welcome back, {firstName}
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                      Your dashboard now pulls together the best bits of
                      Cosmovoid: sky highlights, launch movement, headline
                      stories, asteroid watch, and your own journal trail.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/journal"
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Open my journal
                  </Link>
                  <Link
                    to="/journal/new"
                    className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
                  >
                    Write more
                  </Link>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <article className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                    Journal entries
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {snapshot.journalEntries.length}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Private notes and reflections saved in your orbit.
                  </p>
                </article>
                <article className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                    Headlines loaded
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {snapshot.news.length}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Fresh stories pulled into today's command deck.
                  </p>
                </article>
                <article className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                    Asteroid watch
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {snapshot.asteroidWatchlist.length}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Near-Earth objects listed in today's NASA feed.
                  </p>
                </article>
              </div>

              {error ? (
                <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                  {error}
                </div>
              ) : null}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_26px_56px_rgba(0,0,0,0.3)]">
                {snapshot.apod?.media_type === "image" ? (
                  <img
                    src={snapshot.apod.url}
                    alt={snapshot.apod.title || "Astronomy Picture of the Day"}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.22),rgba(6,8,20,0.98))] px-6 text-center">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-cyan-100/80">
                        APOD Feature
                      </p>
                      <h2 className="mt-3 text-2xl font-medium text-white">
                        {snapshot.apod?.title || "Today's sky highlight"}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                        Picture of the day
                      </p>
                      <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">
                        {snapshot.apod?.title || "Awaiting NASA image feed"}
                      </h2>
                    </div>
                    <Link
                      to="/gallery"
                      className="rounded-full border border-white/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:bg-white/8"
                    >
                      Open gallery
                    </Link>
                  </div>

                  <p className="text-sm leading-7 text-zinc-300">
                    {snapshot.apod?.explanation
                      ? trimText(snapshot.apod.explanation, 220)
                      : "We'll place today's featured sky story here as soon as the feed responds."}
                  </p>

                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {snapshot.apod?.date
                      ? `Captured ${formatDate(snapshot.apod.date)}`
                      : "Waiting for today's issue"}
                  </p>
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(119,147,255,0.12)_0%,rgba(8,10,24,0.95)_100%)] p-6 shadow-[0_26px_56px_rgba(0,0,0,0.3)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                      Flight deck
                    </p>
                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">
                      Launch pulse
                    </h2>
                  </div>
                  <Link
                    to="/launches"
                    className="rounded-full border border-white/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:bg-white/8"
                  >
                    View launches
                  </Link>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/18 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      Latest launch
                    </p>
                    <h3 className="mt-3 text-xl font-medium text-white">
                      {snapshot.latestLaunch?.name || "No recent launch loaded"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-300">
                      {snapshot.latestLaunch?.date_utc
                        ? formatDate(snapshot.latestLaunch.date_utc, {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Launch timing unavailable"}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-zinc-300">
                      {snapshot.latestLaunch?.details
                        ? trimText(snapshot.latestLaunch.details, 140)
                        : "This panel will summarize the most recent mission once data is available."}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-cyan-200/12 bg-cyan-300/8 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/75">
                      Next up
                    </p>
                    <h3 className="mt-3 text-xl font-medium text-white">
                      {snapshot.nextLaunch?.name ||
                        "Watching for the next launch"}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-200">
                      {snapshot.nextLaunch?.date_utc
                        ? formatDate(snapshot.nextLaunch.date_utc, {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Schedule pending"}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-zinc-300">
                      {snapshot.nextLaunch?.details
                        ? trimText(snapshot.nextLaunch.details, 140)
                        : "As new flights show up in the SpaceX feed, this card will keep the next window front and center."}
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_26px_56px_rgba(0,0,0,0.3)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                      Top stories
                    </p>
                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">
                      Space news briefing
                    </h2>
                  </div>
                  <Link
                    to="/news"
                    className="rounded-full border border-white/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:bg-white/8"
                  >
                    Open news
                  </Link>
                </div>

                <div className="mt-6 grid gap-4">
                  {newsItems.length ? (
                    newsItems.map((story) => (
                      <article
                        key={story.id}
                        className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4"
                      >
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
                          <span>{story.news_site}</span>
                          <span>{formatDate(story.published_at)}</span>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-white">
                          {story.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                          {trimText(story.summary, 150)}
                        </p>
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex text-sm font-medium text-cyan-200 transition-colors hover:text-white"
                        >
                          Read source
                        </a>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-black/12 p-5 text-sm text-zinc-300">
                      News cards will appear here once the feed responds.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,197,94,0.08)_0%,rgba(7,11,20,0.96)_100%)] p-6 shadow-[0_26px_56px_rgba(0,0,0,0.3)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                      Near-Earth objects
                    </p>
                    <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">
                      Asteroid watch
                    </h2>
                  </div>
                  <Link
                    to="/asteroids"
                    className="rounded-full border border-white/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:bg-white/8"
                  >
                    Full watchlist
                  </Link>
                </div>

                <div className="mt-6 space-y-4">
                  {asteroidWatchlist.length ? (
                    asteroidWatchlist.map((asteroid) => (
                      <article
                        key={asteroid.id}
                        className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4"
                      >
                        <h3 className="text-lg font-medium text-white">
                          {asteroid.name}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-300">
                          Diameter up to{" "}
                          {Math.round(
                            asteroid.estimated_diameter.kilometers
                              .estimated_diameter_max,
                          )}{" "}
                          km
                        </p>
                        <p className="mt-2 text-sm text-zinc-300">
                          Miss distance{" "}
                          {Number(
                            asteroid.close_approach_data?.[0]?.miss_distance
                              ?.kilometers || 0,
                          ).toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          km
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-black/12 p-5 text-sm text-zinc-300">
                      Today's asteroid watchlist will appear here when NASA data
                      is available.
                    </div>
                  )}
                </div>
              </article>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-6 shadow-[0_26px_56px_rgba(0,0,0,0.3)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                    Jump points
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">
                    Explore the rest of Cosmovoid
                  </h2>
                </div>
                <Link
                  to="/explore"
                  className="rounded-full border border-white/12 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:bg-white/8"
                >
                  Explore all
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {quickLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group rounded-[1.5rem] border border-white/10 bg-black/16 p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/6"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Route
                    </p>
                    <h3 className="mt-3 text-xl font-medium text-white">
                      {item.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {item.copy}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-medium text-cyan-200 transition-colors group-hover:text-white">
                      Open page
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="hidden xl:block">
            <div className="fixed top-30 z-20 w-[450px] max-h-[calc(130vh-0rem)] overflow-y-auto pr-8 right-[calc((85vw-79rem)/2)]">
              {dashboardRail}
            </div>
          </aside>
        </section>

        <aside className="mx-auto mt-8 max-w-7xl xl:hidden">
          {dashboardRail}
        </aside>
      </main>
    </>
  );
};

export default Dashboard;
