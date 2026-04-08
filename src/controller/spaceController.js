const nasaService = require("../services/nasa.service");
const spacexService = require("../services/spacex.service");

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
    const data = await spacexService.getLatestLaunchs();
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

exports.getCrew = async (req, res) => {
  try {
    const data = await spacexService.getCrew();
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
