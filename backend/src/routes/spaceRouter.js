const express = require("express");
const spaceRouter = express.Router();
const spaceController = require("../controller/spaceController");

spaceRouter.get("/apod", spaceController.getApod);
spaceRouter.get(
  "/global/launches/upcoming",
  spaceController.getGlobalUpcomingLaunches,
);
spaceRouter.get(
  "/global/launches/previous",
  spaceController.getGlobalPreviousLaunches,
);
spaceRouter.get("/global/launches/:id", spaceController.getGlobalLaunchById);
spaceRouter.get("/astronauts", spaceController.getAstronauts);
spaceRouter.get("/astronauts/:id", spaceController.getAstronautById);
spaceRouter.get("/launchpads", spaceController.getLaunchPads);
spaceRouter.get("/landpads", spaceController.getLandPads);
spaceRouter.get("/crew", spaceController.getCrew);
spaceRouter.get("/rockets", spaceController.getRockets);
spaceRouter.get("/roadster", spaceController.getRoadster);
spaceRouter.get("/rockets/:id", spaceController.getRocketById);
spaceRouter.get("/crew/:id", spaceController.getCrewById);
spaceRouter.get("/asteroids", spaceController.getAsteroids);
spaceRouter.get("/media/search", spaceController.searchNasaMedia);
spaceRouter.get("/news", spaceController.getSpaceNews);
spaceRouter.get("/events/earth", spaceController.getEarthEvents);
spaceRouter.get("/events/astronomy", spaceController.getAstronomyEvents);
spaceRouter.get("/astronomy/token", spaceController.getAstronomyToken);

module.exports = spaceRouter;
