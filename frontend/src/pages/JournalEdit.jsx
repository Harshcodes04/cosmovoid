import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getJournalEntryById, updateJournalEntry } from "../api/space";

const moodOptions = ["excited", "curious", "reflective", "sad", "happy"];

const JournalEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "curious",
    tags: "",
    observationLocation: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const response = await getJournalEntryById(id);
        const entry = response.data?.entry;
        if (entry) {
          setForm({
            title: entry.title || "",
            content: entry.content || "",
            mood: entry.mood || "curious",
            tags: entry.tags ? entry.tags.join(", ") : "",
            observationLocation: entry.observationLocation || "",
          });
        }
      } catch (err) {
        setError("Could not load journal entry.");
      } finally {
        setLoading(false);
      }
    };
    loadEntry();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        mood: form.mood,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        observationLocation: form.observationLocation.trim(),
      };

      await updateJournalEntry(id, payload);
      navigate(`/journal/${id}`, { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          "We could not save your journal entry right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <header><Navbar /></header>
        <main className="relative overflow-hidden px-6 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-300">
            Loading your journal entry...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="relative overflow-hidden px-6 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0">

        </div>

        <section className="relative mx-auto max-w-4xl space-y-8">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.26em] text-zinc-400">
                Edit journal entry
              </p>
              <h1 className="text-4xl font-light tracking-[-0.06em] text-white sm:text-5xl">
                Refine your thoughts
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                Update your notes, correct details, or add new discoveries.
              </p>
            </div>

            <Link
              to={`/journal/${id}`}
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
            >
              Back to entry
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-100">Title</span>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Tonight's launch notes"
                  className="w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-cyan-300/40"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-100">Mood</span>
                <select
                  name="mood"
                  value={form.mood}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/40"
                >
                  {moodOptions.map((mood) => (
                    <option key={mood} value={mood} className="bg-zinc-900 text-white">
                      {mood}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-100">Content</span>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={10}
                placeholder="What did you discover today?"
                className="w-full rounded-[1.6rem] border border-white/12 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-cyan-300/40"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-100">
                  Tags
                </span>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="launches, apod, mars"
                  className="w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-cyan-300/40"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-100">
                  Observation location
                </span>
                <input
                  type="text"
                  name="observationLocation"
                  value={form.observationLocation}
                  onChange={handleChange}
                  placeholder="Anywhere on Earth"
                  className="w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-cyan-300/40"
                />
              </label>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Saving entry..." : "Save changes"}
              </button>
              <Link
                to={`/journal/${id}`}
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

export default JournalEdit;
