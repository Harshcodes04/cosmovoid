const axios = require("axios");
const cache = require("../utils/cache");

exports.getAstronomyEvents = async () => {
  const cached = await cache.get("astronomy-events");
  if (cached) return cached;

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
        latitude: 28.6139, // default to Delhi for now frontend will pass location later onnnnnn
        longitude: 77.209,
        elevation: 0,
        from_date: new Date().toISOString().slice(0, 10),
        to_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10), // 30 days ahead
        time: "00:00:00",
      },
    },
  );

  cache.set("astronomy-events", response.data, 24 * 60 * 60 * 1000); // 24 hours
  return response.data;
};
