import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpandAlt,
  FaTimes,
} from "react-icons/fa";
import { getApod, searchNasaMedia } from "../api/space";

const PHOTOS_PER_PAGE = 24;
//Rotated in ordder of these
const COSMOS_QUERIES = ["nebula", "galaxy", "hubble", "astronomy", "cosmos"];

const fallbackImages = [
  {
    id: "fallback-carina",
    title: "Cosmic Cliffs in the Carina Nebula",
    date: "2022-07-12",
    thumb:
      "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001982/GSFC_20171208_Archive_e001982~thumb.jpg",
    full: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001982/GSFC_20171208_Archive_e001982~large.jpg",
    description:
      "A glittering star-forming region where young stars sculpt surrounding gas and dust into glowing ridges.",
  },
  {
    id: "fallback-eagle",
    title: "Pillars of Creation",
    date: "2014-10-17",
    thumb: "https://images-assets.nasa.gov/image/PIA22912/PIA22912~thumb.jpg",
    full: "https://images-assets.nasa.gov/image/PIA22912/PIA22912~large.jpg",
    description:
      "Towering columns of gas and dust inside the Eagle Nebula, shaped by radiation from nearby newborn stars.",
  },
  {
    id: "fallback-orion",
    title: "Orion Nebula",
    date: "2012-02-01",
    thumb: "https://images-assets.nasa.gov/image/PIA13959/PIA13959~thumb.jpg",
    full: "https://images-assets.nasa.gov/image/PIA13959/PIA13959~large.jpg",
    description:
      "One of the closest stellar nurseries to Earth, filled with hot young stars and dramatic clouds of illuminated gas.",
  },
  {
    id: "fallback-hubble",
    title: "Hubble Deep Field",
    date: "1995-12-18",
    thumb: "https://images-assets.nasa.gov/image/PIA23645/PIA23645~thumb.jpg",
    full: "https://images-assets.nasa.gov/image/PIA23645/PIA23645~large.jpg",
    description:
      "A deep-space view packed with distant galaxies, revealing how much structure hides inside a tiny patch of sky.",
  },
  {
    id: "fallback-saturn",
    title: "Saturn in Natural Color",
    date: "2013-10-17",
    thumb: "https://images-assets.nasa.gov/image/PIA17172/PIA17172~thumb.jpg",
    full: "https://images-assets.nasa.gov/image/PIA17172/PIA17172~large.jpg",
    description:
      "Saturn's rings stretch around the planet in a calm, luminous portrait from NASA's planetary archives.",
  },
  {
    id: "fallback-jupiter",
    title: "Jupiter Cloud Tops",
    date: "2017-05-25",
    thumb: "https://images-assets.nasa.gov/image/PIA21641/PIA21641~thumb.jpg",
    full: "https://images-assets.nasa.gov/image/PIA21641/PIA21641~large.jpg",
    description:
      "Bands, storms, and swirling cloud structures show the restless atmosphere of the solar system's largest planet.",
  },
];

const fallbackApod = {
  title: "Astronomy Picture of the Day",
  date: new Date().toISOString().slice(0, 10),
  media_type: "image",
  url: fallbackImages[0].full,
  explanation:
    "The live APOD feed is unavailable right now — showing a backup NASA image until the backend reconnects.",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Date unknown";

const trim = (value, limit) => {
  if (!value) return "";
  return value.length > limit ? `${value.slice(0, limit).trimEnd()}…` : value;
};

const getMediaItems = (collection) =>
  (collection?.items || [])
    .map((item) => {
      const data = item.data?.[0] || {};
      // NASA Images API provides a confirmed ~thumb.jpg link in item.links
      const thumbHref = item.links?.find((l) => l.render === "image")?.href;

      // Derive the large image by replacing ~thumb.jpg with ~large.jpg.
      // This is reliable because NASA's CDN always stores both at the same path.
      // Constructing from nasa_id alone fails when filenames differ from the id.
      const fullHref = thumbHref
        ? thumbHref.replace(/~thumb\.(jpg|jpeg|png|gif)$/i, "~large.$1")
        : null;

      return {
        id: data.nasa_id || item.href || data.title,
        title: data.title || "Untitled NASA image",
        date: data.date_created,
        thumb: thumbHref,
        full: fullHref || thumbHref, // fall back to thumb if large derivation failed
        description:
          data.description ||
          data.description_508 ||
          "NASA did not include a longer description for this image.",
        source: data.center,
      };
    })
    .filter((item) => item.thumb && item.title);

/**
 * Normalizes an APOD video URL into a renderable form.
 * Returns: { type: 'mp4'|'embed'|'external', url: string }
 *   - 'mp4'      → use <video> tag
 *   - 'embed'    → use <iframe> (YouTube/Vimeo embed URL)
 *   - 'external' → can't embed; open in a new tab instead
 */
const resolveApodVideo = (rawUrl) => {
  if (!rawUrl) return { type: "external", url: rawUrl };

  // Direct mp4
  if (/\.mp4(\?.*)?$/i.test(rawUrl)) return { type: "mp4", url: rawUrl };

  // YouTube watch → embed
  const ytWatch = rawUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(&.*)?/,
  );
  if (ytWatch) {
    return {
      type: "embed",
      url: `https://www.youtube.com/embed/${ytWatch[1]}?rel=0`,
    };
  }

  // Already a YouTube embed URL
  if (
    rawUrl.includes("youtube.com/embed/") ||
    rawUrl.includes("youtu.be/embed/")
  ) {
    return { type: "embed", url: rawUrl };
  }

  // Vimeo
  const vimeo = rawUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return { type: "embed", url: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  // Anything else (e.g. apod.nasa.gov page URLs) — can't embed reliably
  return { type: "external", url: rawUrl };
};

const fetchMediaPage = async (query, page = 1) => {
  const res = await searchNasaMedia(query, "image", page);
  return getMediaItems(res.data?.collection);
};

const ImageCard = ({ src, alt, className = "", loading = "lazy" }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // If the image is already in the browser cache it fires onLoad before React
  // attaches the handler — check .complete on mount.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={`relative overflow-hidden bg-zinc-950 ${className}`}>
      {/* Skeleton shown while loading or on error */}
      {(!loaded || failed) && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-zinc-950">
          <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />

          {failed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-zinc-600">Image unavailable</span>
            </div>
          )}
        </div>
      )}
      {src && !failed && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-[1.04] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

/* Skeleton */
const GallerySkeleton = () => (
  <div className="space-y-5">
    {/* APOD skeleton — text left / image right */}
    <div className="grid animate-pulse overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 lg:grid-cols-[1fr_480px]">
      <div className="flex flex-col gap-3 p-6 sm:p-8">
        <div className="h-4 w-48 rounded-full bg-white/[0.08]" />
        <div className="h-7 w-3/4 rounded-lg bg-white/[0.07]" />
        <div className="h-7 w-1/2 rounded-lg bg-white/[0.07]" />
        <div className="mt-1 h-4 w-full rounded bg-white/[0.05]" />
        <div className="h-4 w-4/5 rounded bg-white/[0.05]" />
        <div className="mt-2 h-9 w-32 rounded-full bg-white/[0.07]" />
      </div>
      <div className="h-56 bg-white/[0.05] lg:h-auto" />
    </div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.05]"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  </div>
);

const Gallery = () => {
  const [apod, setApod] = useState(null);
  // allPhotos: accumulated pool fetched from NASA (100 per NASA page)
  const [allPhotos, setAllPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [currentSet, setCurrentSet] = useState(0); // 0-indexed frontend set
  // queryState tracks which query + page within that query we've fetched up to
  const [queryState, setQueryState] = useState({ qi: 0, qp: 1 });
  const [hasMore, setHasMore] = useState(true); // more pages/queries available?
  const [error, setError] = useState("");

  // Derived: which 6 photos to show right now
  const photos = allPhotos.length
    ? allPhotos.slice(
        currentSet * PHOTOS_PER_PAGE,
        (currentSet + 1) * PHOTOS_PER_PAGE,
      )
    : fallbackImages;
  const galleryPage = currentSet + 1;

  /* Initial load — APOD + NASA page 1 in parallel */
  useEffect(() => {
    let active = true;
    const init = async () => {
      const [apodResult, mediaResult] = await Promise.allSettled([
        getApod(),
        fetchMediaPage(COSMOS_QUERIES[0], 1),
      ]);
      if (!active) return;
      setApod(
        apodResult.status === "fulfilled"
          ? apodResult.value.data
          : fallbackApod,
      );
      const items = mediaResult.status === "fulfilled" ? mediaResult.value : [];
      setAllPhotos(items);
      setHasMore(true); // always true initially — 5 queries to rotate through
      if (
        apodResult.status === "rejected" ||
        mediaResult.status === "rejected"
      ) {
        setError(
          "Some NASA data could not be reached — showing cached or backup images.",
        );
      }
      setCurrentSet(0);
      setQueryState({ qi: 0, qp: 1 });
      setLoading(false);
    };
    init();
    return () => {
      active = false;
    };
  }, []);

  /* Navigate sets — rotate through cosmos queries when pool is exhausted */
  const goToSet = async (nextSet) => {
    if (nextSet < 0) return;

    // Navigate immediately if we have ANY items for this set
    if (allPhotos.length > nextSet * PHOTOS_PER_PAGE) {
      setCurrentSet(nextSet);
      document
        .getElementById("gallery-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (!hasMore) return;

    setPhotoLoading(true);
    setError("");
    try {
      // Try the next page of the current query
      let { qi, qp } = queryState;
      qp += 1;
      let items = await fetchMediaPage(COSMOS_QUERIES[qi], qp);

      // If current query exhausted, rotate to the next query page 1
      if (items.length === 0) {
        qi = qi + 1;
        qp = 1;
        if (qi >= COSMOS_QUERIES.length) {
          // All queries exhausted
          setHasMore(false);
          setPhotoLoading(false);
          return;
        }
        items = await fetchMediaPage(COSMOS_QUERIES[qi], qp);
      }

      if (items.length === 0) {
        setHasMore(false);
      } else {
        setAllPhotos((prev) => [...prev, ...items]);
        setQueryState({ qi, qp });
        setCurrentSet(nextSet);
        document
          .getElementById("gallery-grid")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch {
      setError("Could not load more images from NASA.");
    } finally {
      setPhotoLoading(false);
    }
  };

  // Whether next-set button should be enabled
  const canGoNext =
    hasMore || allPhotos.length > (currentSet + 1) * PHOTOS_PER_PAGE;

  /* APOD hero data */
  const hero = useMemo(() => {
    if (!apod) return null;
    const isVideo = apod.media_type === "video";
    const isImage = apod.media_type === "image";
    const video = isVideo ? resolveApodVideo(apod.url) : null;
    return {
      id: `apod-${apod.date || "today"}`,
      title: apod.title || "Astronomy Picture of the Day",
      date: apod.date,
      isVideo,
      video, // { type: 'mp4'|'embed'|'external', url }
      // thumbnail_url is set by NASA only for video APODs; fall back to a gallery image
      thumb: isImage
        ? apod.url
        : apod.thumbnail_url || photos[0]?.thumb || fallbackImages[0].thumb,
      full: isImage ? apod.url : photos[0]?.full || fallbackImages[0].full,
      description: apod.explanation || "No description available.",
      source: "Astronomy Picture of the Day",
      copyright: apod.copyright,
    };
  }, [apod, photos]);

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-16 pt-8 md:px-10 lg:px-14 xl:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden"></div>

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <h1 className="text-4xl font-light leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Gallery of the cosmos.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">
                Today&apos;s Astronomy Picture of the Day and deep dive into
                NASA image gallery.
                <br />
                Browse sets using controls below.
              </p>
            </div>
          </div>

          {!loading && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => goToSet(currentSet - 1)}
                disabled={currentSet === 0 || photoLoading}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft className="size-3" />
                Previous set
              </button>

              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-zinc-300">
                {photoLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 animate-spin rounded-full border border-cyan-300 border-t-transparent" />
                    Loading…
                  </span>
                ) : (
                  `Set ${galleryPage}`
                )}
              </span>

              <button
                type="button"
                onClick={() => goToSet(currentSet + 1)}
                disabled={photoLoading || !canGoNext}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-300/18 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next set
                <FaChevronRight className="size-3" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4 text-sm text-amber-200">
            {error}
          </div>
        )}

        {loading ? (
          <GallerySkeleton />
        ) : (
          <div className="space-y-5" id="gallery-grid">
            {hero && (
              <article className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_20px_56px_rgba(0,0,0,0.4)] lg:grid-cols-[1fr_480px]">
                <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-300/25 bg-cyan-300/[0.1] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-cyan-300">
                      Astronomy Picture of the Day
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatDate(hero.date)}
                    </span>
                    {hero.copyright && (
                      <span className="text-xs text-zinc-600">
                        © {hero.copyright}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
                    {hero.title}
                  </h2>
                  <p className="text-sm leading-7 text-zinc-400">
                    {trim(hero.description, 260)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(hero)}
                    className="w-fit inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-300/18 hover:text-white"
                  >
                    <FaExpandAlt className="size-3" />
                    Read more
                  </button>
                </div>

                <div className="relative h-56 lg:h-auto">
                  {hero.isVideo && hero.video?.type === "mp4" ? (
                    <video
                      key={hero.video.url}
                      src={hero.video.url}
                      className="absolute inset-0 h-full w-full object-cover bg-black"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : hero.isVideo && hero.video?.type === "embed" ? (
                    <iframe
                      key={hero.video.url}
                      src={hero.video.url}
                      title={hero.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  ) : hero.isVideo && hero.video?.type === "external" ? (
                    // Non-embeddable URL (e.g. apod.nasa.gov page) — show thumbnail + link
                    <div className="absolute inset-0 group/vid">
                      <ImageCard
                        key={hero.thumb}
                        src={hero.thumb}
                        alt={hero.title}
                        className="absolute inset-0"
                        loading="eager"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <a
                          href={hero.video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ▶ Watch on NASA
                        </a>
                      </div>
                    </div>
                  ) : (
                    <ImageCard
                      key={hero.thumb}
                      src={hero.thumb}
                      alt={hero.title}
                      className="absolute inset-0"
                      loading="eager"
                    />
                  )}
                </div>
              </article>
            )}

            <div
              id="gallery-grid"
              className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 transition-opacity duration-300 ${
                photoLoading ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
            >
              {photos.map((photo, i) => (
                <article
                  key={`${photo.id}-${galleryPage}`} // galleryPage in key forces remount on page change
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950/80 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ImageCard
                    key={`${photo.thumb}-${galleryPage}`}
                    src={photo.thumb}
                    alt={photo.title}
                    className="h-40 sm:h-48"
                    loading={i < 4 ? "eager" : "lazy"}
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-zinc-500">
                      {formatDate(photo.date)}
                    </p>
                    <h2 className="mt-2 text-base font-semibold leading-snug text-white">
                      {photo.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">
                      {trim(photo.description, 110)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(photo)}
                      className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-300/18 hover:text-white"
                    >
                      <FaExpandAlt className="size-3" />
                      Read more
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => goToSet(currentSet - 1)}
                disabled={currentSet === 0 || photoLoading}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft className="size-3" />
                Previous
              </button>
              <span className="text-sm text-zinc-500">Set {galleryPage}</span>
              <button
                type="button"
                onClick={() => goToSet(currentSet + 1)}
                disabled={photoLoading || !canGoNext}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-300/18 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <FaChevronRight className="size-3" />
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-dialog-title"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedPhoto(null)
          }
        >
          <article className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/12 bg-black/50 text-zinc-100 backdrop-blur transition-colors hover:bg-white/12"
              aria-label="Close"
            >
              <FaTimes className="size-4" />
            </button>
            <div className="grid lg:grid-cols-[minmax(0,1.2fr)_380px]">
              {selectedPhoto.isVideo && selectedPhoto.video?.type === "mp4" ? (
                <video
                  key={selectedPhoto.video.url}
                  src={selectedPhoto.video.url}
                  className="min-h-[22rem] w-full bg-black object-cover lg:min-h-[36rem]"
                  controls
                  autoPlay
                  muted
                  playsInline
                />
              ) : selectedPhoto.isVideo &&
                selectedPhoto.video?.type === "embed" ? (
                <iframe
                  key={selectedPhoto.video.url}
                  src={selectedPhoto.video.url}
                  title={selectedPhoto.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="min-h-[22rem] w-full border-0 lg:min-h-[36rem]"
                />
              ) : selectedPhoto.isVideo &&
                selectedPhoto.video?.type === "external" ? (
                // Non-embeddable — thumbnail + external link
                <div className="relative min-h-[22rem] lg:min-h-[36rem]">
                  <ImageCard
                    key={selectedPhoto.thumb}
                    src={selectedPhoto.thumb}
                    alt={selectedPhoto.title}
                    className="absolute inset-0"
                    loading="eager"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <a
                      href={selectedPhoto.video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
                    >
                      ▶ Watch on NASA
                    </a>
                  </div>
                </div>
              ) : (
                <ImageCard
                  key={selectedPhoto.full || selectedPhoto.thumb}
                  src={selectedPhoto.full || selectedPhoto.thumb}
                  alt={selectedPhoto.title}
                  className="min-h-[22rem] lg:min-h-[36rem]"
                  loading="eager"
                />
              )}
              <div className="p-7">
                <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {selectedPhoto.source || "NASA"}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {formatDate(selectedPhoto.date)}
                  </span>
                </div>
                <h2
                  id="gallery-dialog-title"
                  className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl"
                >
                  {selectedPhoto.title}
                </h2>
                {selectedPhoto.copyright && (
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Credit: {selectedPhoto.copyright}
                  </p>
                )}
                <p className="mt-6 whitespace-pre-line text-sm leading-7 text-zinc-300">
                  {selectedPhoto.description}
                </p>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  );
};

export default Gallery;
