import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getJournalEntryById, deleteJournalEntry } from "../api/space";

const formatDate = (value) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const JournalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteJournalEntry(id);
      navigate("/journal", { replace: true });
    } catch (err) {
      setError("Failed to delete journal entry.");
      setDeleting(false);
    }
  };

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
              to={`/journal/${id}/edit`}
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <Link
              to="/journal/new"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Write more
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-300">
              Loading your journal entry...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-6 text-sm text-amber-100">
              {error}
            </div>
          ) : entry ? (
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10">
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

              {`Location: ${entry.observationLocation}`}
            </article>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-300">
              Journal entry not found.
            </div>
          )}
        </section>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#080808] p-6">
              <h3 className="text-xl font-medium text-white">Delete Entry?</h3>
              <p className="mt-3 text-sm text-zinc-300">
                Are you sure you want to delete this journal entry? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-full border border-white/14 bg-white/6 px-5 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-full bg-rose-500/20 px-5 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default JournalDetails;
