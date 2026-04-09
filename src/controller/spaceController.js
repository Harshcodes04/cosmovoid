const nasaService = require("../services/nasa.service");
const spacexService = require("../services/spacex.service");
const newsservice = require("../services/news.service");

exports.getApod = async (req, res, next) => {
  try {
    const apodData = await nasaService.getApod();
    res.json(apodData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestLaunch = async (req, res) => {
  try {
    const data = await spacexService.getLatestLaunch();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaunchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await spacexService.getLaunchById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcomingLaunches = async (req, res) => {
  try {
    const data = await spacexService.getUpcomingLaunches();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPastLaunches = async (req, res) => {
  try {
    const data = await spacexService.getPastLaunches();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRockets = async (req, res) => {
  try {
    const data = await spacexService.getRockets();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRocketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await spacexService.getRocketById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCrew = async (req, res) => {
  try {
    const data = await spacexService.getCrew();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCrewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await spacexService.getCrewById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLaunchPads = async (req, res) => {
  try {
    const data = await spacexService.getLaunchPads();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLandPads = async (req, res) => {
  try {
    const data = await spacexService.getLandPads();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoadster = async (req, res) => {
  try {
    const data = await spacexService.getRoadster();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAsteroids = async (req, res, next) => {
  try {
    const data = await nasaService.getAsteroids();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchNasaMedia = async (req, res, next) => {
  try {
    const { query, mediaType } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    const data = await nasaService.searchNasaMedia(query, mediaType);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSpaceNews = async (req, res, next) => {
  try {
    const data = await newsservice.getSpaceNews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
