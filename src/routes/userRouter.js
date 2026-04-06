const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");

// userRouter.get("/journal", userController.getJournalEntries);
// userRouter.get("/journal/:id", userController.getJournalEntryById);
// userRouter.post("/journal", userController.createJournalEntry);
// userRouter.put("/journal/:id", userController.updateJournalEntry);
// userRouter.delete("/journal/:id", userController.deleteJournalEntry);

module.exports = userRouter;
