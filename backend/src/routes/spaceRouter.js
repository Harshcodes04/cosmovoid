const express = require("express");
const spaceRouter = express.Router();
const spaceController = require("../controller/spaceController");

spaceRouter.get("/apod", spaceController.getApod);
spaceRouter.get("/asteroids", spaceController.getAsteroids);
spaceRouter.get("/media/search", spaceController.searchNasaMedia);
spaceRouter.get("/events/earth", spaceController.getEarthEvents);
spaceRouter.get("/events/astronomy", spaceController.getAstronomyEvents);
spaceRouter.get("/news", spaceController.getSpaceNews);
spaceRouter.get("/rockets", spaceController.getRockets);
spaceRouter.get("/rockets/:id", spaceController.getRocketById);
spaceRouter.get("/launchpads", spaceController.getLaunchPads);
spaceRouter.get("/landpads", spaceController.getLandPads);
spaceRouter.get("/roadster", spaceController.getRoadster);
spaceRouter.get("/global/launches/upcoming", spaceController.getGlobalUpcomingLaunches);
spaceRouter.get("/global/launches/previous", spaceController.getGlobalPreviousLaunches);
spaceRouter.get("/global/launches/:id", spaceController.getGlobalLaunchById);
spaceRouter.get("/astronauts", spaceController.getAstronauts);
spaceRouter.get("/astronauts/:id", spaceController.getAstronautById);

module.exports = spaceRouter;
