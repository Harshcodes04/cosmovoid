const express = require("express");
const spaceRouter = express.Router();
const spaceController = require("../controller/spaceController");

spaceRouter.get("/apod", spaceController.getApod);
spaceRouter.get("/launches/latest", spaceController.getLatestLaunch);
spaceRouter.get("/launches/upcoming", spaceController.getUpcomingLaunches);
spaceRouter.get("/launches/past", spaceController.getPastLaunches);
spaceRouter.get("/launchpads", spaceController.getLaunchPads);
spaceRouter.get("/landpads", spaceController.getLandPads);
spaceRouter.get("/crew", spaceController.getCrew);
spaceRouter.get("/rockets", spaceController.getRockets);
spaceRouter.get("/roadster", spaceController.getRoadster);
spaceRouter.get("/launches/:id", spaceController.getLaunchById);
spaceRouter.get("/rockets/:id", spaceController.getRocketById);
spaceRouter.get("/crew/:id", spaceController.getCrewById);
spaceRouter.get("/asteroids", spaceController.getAsteroids);
spaceRouter.get("/media/search", spaceController.searchNasaMedia);
spaceRouter.get("/news", spaceController.getSpaceNews);
spaceRouter.get("/events/earth", spaceController.getEarthEvents);
spaceRouter.get("/events/astronomy", spaceController.getAstronomyEvents);

module.exports = spaceRouter;
