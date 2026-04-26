import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getJournalEntryById } from "../api/space";

const formatDate = (value) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const JournalDetails = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadEntry = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getJournalEntryById(id);

        if (!active) return;

        setEntry(response.data?.entry || null);
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError.response?.data?.message ||
            "We could not load this journal entry.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadEntry();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="relative overflow-hidden px-6 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-[10%] top-24 h-72 w-72 rounded-full bg-fuchsia-400/8 blur-3xl" />
        </div>

        <section className="relative mx-auto max-w-4xl space-y-8">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/journal"
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
            >
              Back to my journal
            </Link>
            <Link
              to="/journal/new"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Write more
            </Link>
          </div>

          {loading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 text-sm text-zinc-300">
              Loading your journal entry...
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 text-sm text-amber-100">
              {error}
            </div>
          ) : entry ? (
            <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(12,18,40,0.96)_0%,rgba(10,12,24,0.98)_100%)] p-6 shadow-[0_26px_56px_rgba(0,0,0,0.3)] sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-zinc-400">
                <span>{formatDate(entry.createdAt)}</span>
                {entry.mood ? (
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-zinc-300">
                    {entry.mood}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl">
                {entry.title}
              </h1>

              <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-zinc-200">
                {entry.content}
              </p>

              {entry.tags?.length ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/6 px-3 py-1 text-xs text-zinc-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {entry.linkedApod ? (
                <a
                  href={entry.linkedApod}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex text-sm font-medium text-cyan-200 transition-colors hover:text-white"
                >
                  Open linked APOD reference
                </a>
              ) : null}
            </article>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 text-sm text-zinc-300">
              Journal entry not found.
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default JournalDetails;
