// Event data lives in ../data/skyEvents.json  Curated upcoming astronomical events for 2026–2027. Couldn't find live api for this😭if found i will surely replace it with the hardcoded data in the meantime it will be in json format and will be updates timem to time manually.
const EVENTS = require("../data/skyEvents.json");

exports.getSkyEvents = () => {
  const now = new Date();
  const upcoming = EVENTS
    .filter((e) => new Date(e.peak) > now)
    .sort((a, b) => new Date(a.peak) - new Date(b.peak));
  return upcoming;
};
