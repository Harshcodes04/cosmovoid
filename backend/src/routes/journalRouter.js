const express = require("express");
const journalRouter = express.Router();
const journalController = require("../controller/journalController");
const authMiddleware = require("../middleware/auth");

journalRouter.use(authMiddleware);

journalRouter.get("/", journalController.getJournalEntries);
journalRouter.get("/:id", journalController.getJournalEntryById);
journalRouter.post("/", journalController.createJournalEntry);
journalRouter.put("/:id", journalController.updateJournalEntry);
journalRouter.delete("/:id", journalController.deleteJournalEntry);

module.exports = journalRouter;
