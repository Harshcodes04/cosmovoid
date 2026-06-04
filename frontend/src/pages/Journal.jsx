import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getJournalEntries } from "../api/space";

const formatDate = (value) => {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const trimText = (value, limit) => {
  if (!value) return "";
  if (value.length <= limit) return value;
  return `${value.slice(0, limit).trim()}...`;
};

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadEntries = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getJournalEntries();

        if (!active) return;

        setEntries(response.data?.entries || []);
      } catch {
        if (!active) return;
        setError("We could not load your journal entries right now.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadEntries();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="relative overflow-hidden px-6 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0">

        </div>

        <section className="relative mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.26em] text-zinc-400">
                My journal
              </p>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl">
                  Your written orbit
                </h1>
                {!loading && entries.length > 0 && (
                  <span className="self-start mt-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-200">
                    {entries.length}
                  </span>
                )}
              </div>
              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                Keep track of discoveries, thoughts, moods, and the stories
                you want to remember after each deep-space rabbit hole.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
              >
                Back to dashboard
              </Link>
              <Link
                to="/journal/new"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Write a new entry
              </Link>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-300">
              Loading your journal entries...
            </div>
          ) : entries.length ? (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry) => (
                <Link
                  key={entry._id}
                  to={`/journal/${entry._id}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {formatDate(entry.createdAt)}
                    </p>
                    {entry.mood ? (
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                        {entry.mood}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-white">
                    {entry.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {trimText(entry.content, 170)}
                  </p>

                  {entry.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/6 px-3 py-1 text-xs text-zinc-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <span className="mt-5 inline-flex text-sm font-medium text-cyan-200 transition-colors group-hover:text-white">
                    Open entry
                  </span>
                </Link>
              ))}
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-white/10 bg-transparent p-12 text-center">
              <h2 className="text-2xl font-medium text-white">
                No journal entries yet
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-300">
                Start your first log and this page will become your personal
                archive of cosmic thoughts, linked discoveries, and mission
                notes.
              </p>
              <Link
                to="/journal/new"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Create first entry
              </Link>
            </section>
          )}
        </section>
      </main>
    </>
  );
};

export default Journal;
