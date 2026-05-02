import { useEffect, useMemo, useState } from "react";
import { getNews } from "../api/space";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Date pending";

const trimText = (value, limit) => {
  if (!value) return "";
  return value.length > limit ? `${value.slice(0, limit).trimEnd()}...` : value;
};

const blockedSourceHosts = new Set(["nasaspaceflight.com"]);

const getArticleHost = (article) => {
  try {
    return new URL(article?.url || "").hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const isBlockedSource = (article) =>
  blockedSourceHosts.has(getArticleHost(article)) ||
  article?.news_site?.toLowerCase() === "nasaspaceflight";

const canOpenSource = (article) => Boolean(article?.url) && !isBlockedSource(article);

const ArticleLink = ({ article, children, className = "" }) =>
  canOpenSource(article) ? (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );

const SourceAction = ({ article }) =>
  canOpenSource(article) ? (
    <span className="mt-5 text-sm font-medium text-cyan-300 transition-colors group-hover:text-white">
      Read source
    </span>
  ) : (
    <span className="mt-5 inline-flex w-fit rounded-full border border-amber-300/20 bg-amber-300/8 px-3 py-1.5 text-xs font-medium text-amber-100">
      Source blocked
    </span>
  );

const ImageBlank = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`relative overflow-hidden bg-[linear-gradient(135deg,rgba(8,12,24,0.98)_0%,rgba(24,28,48,0.95)_52%,rgba(6,8,18,0.98)_100%)] ${className}`}
  >
    <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.06)_45%,transparent_70%)]" />
    <div className="absolute left-8 top-8 h-16 w-16 rounded-full border border-white/8 bg-white/5 blur-sm" />
    <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full bg-cyan-300/5 blur-2xl" />
  </div>
);

const ArticleImage = ({ article, className = "", loading = "lazy" }) => {
  const src = article?.image_url;
  const [loadedSrc, setLoadedSrc] = useState("");
  const [failedSrc, setFailedSrc] = useState("");
  const isLoaded = Boolean(src && loadedSrc === src);
  const hasFailed = Boolean(src && failedSrc === src);

  return (
    <div className={`relative overflow-hidden bg-zinc-950 ${className}`}>
      {(!isLoaded || hasFailed) && <ImageBlank className="absolute inset-0" />}
      {src && !hasFailed && (
        <img
          src={src}
          alt={article?.title || ""}
          loading={loading}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
          className={`h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

const SkeletonCard = ({ large = false }) => (
  <div
    className={`overflow-hidden rounded-3xl border border-white/10 bg-white/5 ${
      large ? "lg:col-span-2" : ""
    }`}
  >
    <div className={`${large ? "h-80" : "h-48"} animate-pulse bg-white/8`} />
    <div className="space-y-3 p-5">
      <div className="h-3 w-28 animate-pulse rounded-full bg-white/8" />
      <div className="h-5 w-4/5 animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-full animate-pulse rounded-full bg-white/8" />
      <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/8" />
    </div>
  </div>
);

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeSource, setActiveSource] = useState("All");

  const loadNews = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNews();
      setArticles(response.data?.results || []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "The news feed could not be reached right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const sources = useMemo(() => {
    const uniqueSources = new Set(
      articles.map((article) => article.news_site).filter(Boolean),
    );
    return ["All", ...Array.from(uniqueSources).sort()];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const sourceMatches =
        activeSource === "All" || article.news_site === activeSource;
      const queryMatches =
        !normalizedQuery ||
        [article.title, article.summary, article.news_site]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));

      return sourceMatches && queryMatches;
    });
  }, [activeSource, articles, query]);

  const leadStory = filteredArticles[0];
  const secondaryStories = filteredArticles.slice(1);

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-32 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-300/8 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-2 text-xs font-medium text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
              Live space briefing
            </span>
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
                Space news,
                <br />
                freshly pulled into orbit.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                Track the latest discoveries, launches, mission updates, and
                industry signals from trusted space reporting sources.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <label className="text-sm font-medium text-zinc-200" htmlFor="news-search">
              Search stories
            </label>
            <input
              id="news-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search missions, agencies, rockets..."
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-300/50"
            />
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
              <span>{filteredArticles.length} stories showing</span>
              <button
                type="button"
                onClick={loadNews}
                className="rounded-full border border-white/10 px-3 py-1.5 text-zinc-300 transition-colors hover:bg-white/8 hover:text-white"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {sources.map((source) => (
            <button
              type="button"
              key={source}
              onClick={() => setActiveSource(source)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                activeSource === source
                  ? "border-cyan-300/40 bg-cyan-300/14 text-cyan-100"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {source}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/8 p-5 text-sm text-amber-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>
              <button
                type="button"
                onClick={loadNews}
                className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-zinc-950 transition-opacity hover:opacity-90"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {loading ? (
            <>
              <SkeletonCard large />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : leadStory ? (
            <>
              <article className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/75 shadow-[0_24px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:col-span-2">
                <ArticleLink article={leadStory} className="block">
                  <div className="relative overflow-hidden">
                    <ArticleImage
                      article={leadStory}
                      className="h-[22rem] sm:h-[26rem]"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 space-y-4 p-6 sm:p-8">
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-200">
                        <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 backdrop-blur">
                          {leadStory.news_site || "Space News"}
                        </span>
                        <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 backdrop-blur">
                          {formatDate(leadStory.published_at)}
                        </span>
                      </div>
                      <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-4xl">
                        {leadStory.title}
                      </h2>
                      <p className="max-w-2xl text-sm leading-6 text-zinc-300">
                        {trimText(leadStory.summary, 190)}
                      </p>
                      <SourceAction article={leadStory} />
                    </div>
                  </div>
                </ArticleLink>
              </article>

              {secondaryStories.map((article) => (
                <article
                    key={article.id}
                  className={`group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/75 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform duration-300 ${
                    canOpenSource(article) ? "hover:-translate-y-1" : ""
                  }`}
                >
                  <ArticleLink
                    article={article}
                    className="flex h-full flex-col"
                  >
                    <div className="relative overflow-hidden bg-white/5">
                      <ArticleImage article={article} className="h-52" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                        <span className="rounded-full border border-white/10 px-2.5 py-1">
                          {article.news_site || "Space News"}
                        </span>
                        <span className="rounded-full border border-white/10 px-2.5 py-1">
                          {formatDate(article.published_at)}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold leading-snug text-white">
                        {article.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
                        {trimText(article.summary, 140)}
                      </p>
                      <SourceAction article={article} />
                    </div>
                  </ArticleLink>
                </article>
              ))}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/12 bg-white/5 p-8 text-center text-sm text-zinc-400 lg:col-span-3">
              No stories match your current filters.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default News;
