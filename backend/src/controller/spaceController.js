const nasaService = require("../services/nasa.service");
const spacexService = require("../services/spacex.service");
const newsservice = require("../services/news.service");
const llService = require("../services/launchlibrary.service");
const asyncHandler = require("../utils/asyncHandler");

exports.getApod = asyncHandler(async (req, res, next) => {
  const apodData = await nasaService.getApod();
  res.json(apodData);
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

// ── Global launches (Launch Library 2 — all agencies) ──────────────────────
exports.getGlobalUpcomingLaunches = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const data = await llService.getUpcomingGlobalLaunches(limit);
  res.json(data);
});

exports.getGlobalPreviousLaunches = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const data = await llService.getPreviousGlobalLaunches(limit);
  res.json(data);
});

exports.getGlobalLaunchById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await llService.getGlobalLaunchById(id);
  res.json(data);
});

exports.getAstronauts = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 25, 50);
  const filters = {};
  if (req.query.in_space) filters.in_space = req.query.in_space;
  if (req.query.status_ids) filters.status_ids = req.query.status_ids;
  if (req.query.agency) filters.agency__abbrev = req.query.agency;
  const data = await llService.getAstronauts(limit, filters);
  res.json(data);
});

exports.getAstronautById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await llService.getAstronautById(id);
  res.json(data);
});
