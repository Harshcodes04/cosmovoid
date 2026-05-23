const axios = require("axios");
const { getOrRefresh } = require("../utils/staleCache");

const DAY = 24 * 60 * 60 * 1000;

exports.getAstronomyEvents = () => {
  const fromDate = new Date().toISOString().slice(0, 10);
  const toDate = new Date(Date.now() + 30 * DAY).toISOString().slice(0, 10);

  return getOrRefresh({
    key: `astronomy-events:${fromDate}:${toDate}`,
    source: "astronomy-api",
    ttlMs: DAY,
    staleMs: 14 * DAY,
    fetcher: async () => {
      const authString = Buffer.from(
        `${process.env.ASTRONOMY_API_ID}:${process.env.ASTRONOMY_API_SECRET}`,
      ).toString("base64");

      const response = await axios.get(
        "https://api.astronomyapi.com/api/v2/bodies/events",
        {
          headers: {
            Authorization: `Basic ${authString}`,
          },
          params: {
            latitude: 28.6139,
            longitude: 77.209,
            elevation: 0,
            from_date: fromDate,
            to_date: toDate,
            time: "00:00:00",
          },
        },
      );

      return response.data;
    },
  });
};
