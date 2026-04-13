const nasaService = require("../services/nasa.service");
const spacexService = require("../services/spacex.service");
const newsservice = require("../services/news.service");
const asyncHandler = require("../utils/asyncHandler");

exports.getApod = asyncHandler(async (req, res, next) => {
  const apodData = await nasaService.getApod();
  res.json(apodData);
});
exports.getLatestLaunch = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getLatestLaunch();
  res.json(data);
});
exports.getLaunchById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = await spacexService.getLaunchById(id);
  res.json(data);
});

exports.getUpcomingLaunches = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getUpcomingLaunches();
  res.json(data);
});

exports.getPastLaunches = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getPastLaunches();
  res.json(data);
});

exports.getRockets = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getRockets();
  res.json(data);
});

exports.getRocketById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = await spacexService.getRocketById(id);
  res.json(data);
});

exports.getCrew = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getCrew();
  res.json(data);
});

exports.getCrewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = await spacexService.getCrewById(id);
  res.json(data);
});

exports.getLaunchPads = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getLaunchPads();
  res.json(data);
});

exports.getLandPads = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getLandPads();
  res.json(data);
});

exports.getRoadster = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getRoadster();
  res.json(data);
});

exports.getAsteroids = asyncHandler(async (req, res, next) => {
  const data = await nasaService.getAsteroids();
  res.json(data);
});

exports.searchNasaMedia = asyncHandler(async (req, res, next) => {
  const { query, mediaType } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  const data = await nasaService.searchNasaMedia(query, mediaType);
  res.json(data);
});

exports.getSpaceNews = asyncHandler(async (req, res, next) => {
  const data = await newsservice.getSpaceNews();
  res.json(data);
});

exports.getEarthEvents = asyncHandler(async (req, res) => {
  const data = await nasaService.getEarthEvents();
  res.json(data);
});

const astronomyService = require("../services/astronomy.service");

exports.getAstronomyEvents = asyncHandler(async (req, res) => {
  const data = await astronomyService.getAstronomyEvents();
  res.json(data);
});

exports.getAstronomyToken = (req, res) => {
  const authString = Buffer.from(
    `${process.env.ASTRONOMY_API_ID}:${process.env.ASTRONOMY_API_SECRET}`,
  ).toString("base64");
  res.json({ token: authString });
};
