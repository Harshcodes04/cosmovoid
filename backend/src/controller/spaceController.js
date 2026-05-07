const nasaService = require("../services/nasa.service");
const spacexService = require("../services/spacex.service");
const launchLibraryService = require("../services/launchLibrary.service");
const newsservice = require("../services/news.service");
const asyncHandler = require("../utils/asyncHandler");
const astronomyService = require("../services/astronomy.service");


exports.getApod = asyncHandler(async (req, res, next) => {
  const apodData = await nasaService.getApod();
  res.json(apodData);
});

exports.getLatestLaunch = asyncHandler(async (req, res, next) => {
  const data = await spacexService.getLatestLaunch();
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

exports.getGlobalUpcomingLaunches = asyncHandler(async (req, res, next) => {
  const data = await launchLibraryService.getUpcomingLaunches(req.query);
  res.json(data);
});

exports.getGlobalPreviousLaunches = asyncHandler(async (req, res, next) => {
  const data = await launchLibraryService.getPreviousLaunches(req.query);
  res.json(data);
});

exports.getGlobalLaunchById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = await launchLibraryService.getLaunchById(id);
  res.json(data);
});

exports.getAstronauts = asyncHandler(async (req, res, next) => {
  const data = await launchLibraryService.getAstronauts(req.query);
  res.json(data);
});

exports.getAstronautById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = await launchLibraryService.getAstronautById(id);
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
