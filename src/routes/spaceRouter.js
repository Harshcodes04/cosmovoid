const express = require("express");
const spaceRouter = express.Router();
const spaceController = require("../controller/spaceController");

spaceRouter.get("/", spaceController.getApod);
spaceRouter.get("/launches/latest", spaceController.getLatestLaunch);
spaceRouter.get("/launches/upcoming", spaceController.getUpcomingLaunches);
spaceRouter.get("/launches/past", spaceController.getPastLaunches);
spaceRouter.get("/launchpads", spaceController.getLaunchPads);
spaceRouter.get("/landpads", spaceController.getLandPads);
spaceRouter.get("/crew", spaceController.getCrew);
spaceRouter.get("/rockets", spaceController.getRockets);
spaceRouter.get("/roadster", spaceController.getRoadster);

module.exports = spaceRouter;
