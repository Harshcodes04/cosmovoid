const mongoose = require("mongoose");
const ApiCache = require("../models/apiCache");

const inFlight = new Map();
const memoryCache = new Map();

const isMongoReady = () => mongoose.connection.readyState === 1;

const rememberError = async (key, error) => {
  if (!isMongoReady()) return;
  await ApiCache.updateOne(
    { key },
    {
      $set: {
        lastError: {
          message: error.message,
          status: error.status || error.response?.status,
          at: new Date(),
        },
      },
    },
  ).catch(() => {});
};

const writeEntry = async ({ key, source, data, ttlMs, staleMs }) => {
  const now = Date.now();
  const entry = {
    key,
    source,
    data,
    freshUntil: new Date(now + ttlMs),
    staleUntil: new Date(now + staleMs),
    lastFetchedAt: new Date(now),
    lastError: undefined,
  };

  memoryCache.set(key, entry);

  if (isMongoReady()) {
    await ApiCache.findOneAndUpdate(
      { key },
      { $set: entry, $unset: { lastError: "" } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
  }

  return data;
};

const readEntry = async (key) => {
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry) return memoryEntry;
  if (!isMongoReady()) return null;

  const doc = await ApiCache.findOne({ key }).lean();
  if (!doc) return null;
  memoryCache.set(key, doc);
  return doc;
};

const refreshEntry = async ({ key, source, ttlMs, staleMs, fetcher }) => {
  if (inFlight.has(key)) return inFlight.get(key);

  const task = (async () => {
    try {
      const data = await fetcher();
      return writeEntry({ key, source, data, ttlMs, staleMs });
    } catch (error) {
      await rememberError(key, error);
      throw error;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, task);
  return task;
};

exports.getOrRefresh = async ({
  key,
  source,
  ttlMs,
  staleMs,
  fetcher,
}) => {
  const entry = await readEntry(key);
  const now = Date.now();

  if (entry && new Date(entry.freshUntil).getTime() > now) {
    return entry.data;
  }

  if (entry && new Date(entry.staleUntil).getTime() > now) {
    refreshEntry({ key, source, ttlMs, staleMs, fetcher }).catch(() => {});
    return entry.data;
  }

  try {
    return await refreshEntry({ key, source, ttlMs, staleMs, fetcher });
  } catch (error) {
    if (entry?.data) return entry.data;
    throw error;
  }
};

exports.findCachedListItem = async ({ keyPrefix, id }) => {
  const stringId = String(id);
  const memoryEntries = Array.from(memoryCache.entries())
    .filter(([key]) => key.startsWith(keyPrefix))
    .map(([, entry]) => entry);

  for (const entry of memoryEntries) {
    const item = entry?.data?.results?.find((result) => String(result.id) === stringId);
    if (item) return item;
  }

  if (!isMongoReady()) return null;

  const docs = await ApiCache.find({
    key: { $regex: `^${keyPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}` },
    staleUntil: { $gt: new Date() },
  }).lean();

  for (const doc of docs) {
    const item = doc?.data?.results?.find((result) => String(result.id) === stringId);
    if (item) return item;
  }

  return null;
};
