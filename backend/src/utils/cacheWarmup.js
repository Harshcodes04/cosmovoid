/**
 * cacheWarmup.js
 *
 * Proactively populates the cache on server startup so the first real user
 * never triggers a cold API call (and potentially hits a rate limit).
 *
 * Also schedules periodic background refreshes so data stays warm.
 */

const mongoose = require("mongoose");
const nasaService = require("../services/nasa.service");
const spacexService = require("../services/spacex.service");
const newsService = require("../services/news.service");
const astronomyService = require("../services/astronomy.service");
const launchLibraryService = require("../services/launchLibrary.service");

// Small helper: run a fetch quietly, log result
const warmup = async (name, fn) => {
  try {
    await fn();
    console.log(`[cache-warmup] ✅  ${name}`);
  } catch (err) {
    // Don't crash the server — stale data may already exist in MongoDB
    console.warn(`[cache-warmup] ⚠️  ${name} failed: ${err.message}`);
  }
};

/**
 * Only calls the fetcher if there is NO fresh entry in MongoDB for that key.
 * Use this for APIs with very tight rate limits (e.g. Astronomy API free tier).
 */
const warmupIfStale = async (name, cacheKey, fn) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const ApiCache = require("../models/apiCache");
      const entry = await ApiCache.findOne({ key: cacheKey }).lean();
      if (entry && new Date(entry.freshUntil).getTime() > Date.now()) {
        console.log(`[cache-warmup] ⏭️  ${name} — cache still fresh, skipping`);
        return;
      }
    }
    await fn();
    console.log(`[cache-warmup] ✅  ${name}`);
  } catch (err) {
    console.warn(`[cache-warmup] ⚠️  ${name} failed: ${err.message}`);
  }
};

// Delay between individual fetches so we don't hammer all APIs at once
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const warmAll = async () => {
  console.log("[cache-warmup] Starting cache warmup...");

  // NASA — most rate-limited, fetch first with small gaps
  await warmup("NASA APOD", () => nasaService.getApod());
  await delay(500);
  await warmup("NASA Asteroids", () => nasaService.getAsteroids());
  await delay(500);
  await warmup("NASA Earth Events", () => nasaService.getEarthEvents());
  await delay(500);

  // Astronomy API — extremely limited free tier.
  // warmupIfStale checks MongoDB first and skips the API call if data is still fresh.
  // This means at most 1 real API call per day regardless of how many times warmup runs.
  const today = new Date().toISOString().slice(0, 10);
  await warmupIfStale(
    "Astronomy Events",
    `astronomy-events:${today}`,
    () => astronomyService.getAstronomyEvents(),
  );
  await delay(500);

  // SpaceX — generous limits, no delay needed
  await warmup("SpaceX Latest Launch", () => spacexService.getLatestLaunch());
  await warmup("SpaceX Rockets", () => spacexService.getRockets());
  await warmup("SpaceX Crew", () => spacexService.getCrew());
  await warmup("SpaceX Upcoming Launches", () => spacexService.getUpcomingLaunches());

  // Launch Library (The Space Devs) — global launches & astronauts
  await warmup("Global Upcoming Launches", () => launchLibraryService.getUpcomingLaunches());
  await warmup("Astronauts", () => launchLibraryService.getAstronauts());

  // News
  await warmup("Space News", () => newsService.getSpaceNews());

  console.log("[cache-warmup] Done.");
};

/**
 * Call this once after MongoDB connects.
 * Runs warmup immediately, then every 6 hours in the background.
 */
exports.startWarmup = () => {
  // First warmup after a short delay (let DB stabilise)
  setTimeout(warmAll, 3000);

  // Re-warm every 6 hours — ensures TTLs never expire during the day
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  setInterval(warmAll, SIX_HOURS);
};
