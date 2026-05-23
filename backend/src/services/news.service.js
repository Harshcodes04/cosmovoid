const axios = require("axios");
const { getOrRefresh } = require("../utils/staleCache");

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

exports.getSpaceNews = () =>
  getOrRefresh({
    key: "space-news",
    source: "spaceflight-news",
    ttlMs: HOUR,
    staleMs: 7 * DAY,
    fetcher: async () => {
      const res = await axios.get(
        "https://api.spaceflightnewsapi.net/v4/articles/?limit=20",
      );
      return res.data;
    },
  });
