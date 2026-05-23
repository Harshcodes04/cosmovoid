// Event data lives in ../data/skyEvents.json — edit that file to add or update events.
const EVENTS = require("../data/skyEvents.json");

exports.getSkyEvents = () => {
  const now = new Date();
  return EVENTS
    .filter((e) => new Date(e.peak) > now)
    .sort((a, b) => new Date(a.peak) - new Date(b.peak));
};
