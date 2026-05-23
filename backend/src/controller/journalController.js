const journalEntry = require("../models/journalEntry");
const asyncHandler = require("../utils/asyncHandler");

exports.getJournalEntries = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const entries = await journalEntry
    .find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ entries });
});
exports.getJournalEntryById = asyncHandler(async (req, res, next) => {
  const entry = await journalEntry.findOne({ _id: req.params.id });
  if (!entry) {
    return res.status(404).json({ message: "Journal entry not found" });
  }
  if (entry.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  res.json({ entry });
});

exports.createJournalEntry = asyncHandler(async (req, res, next) => {
  const { title, content, mood, tags, observationLocation } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const newEntry = new journalEntry({
    userId: req.user._id,
    title,
    content,
    mood,
    tags,
    observationLocation,
  });
  await newEntry.save();
  res.status(201).json({ entry: newEntry });
});
exports.updateJournalEntry = asyncHandler(async (req, res, next) => {
  const { title, content, mood, tags, observationLocation } = req.body;
  const updateEntry = await journalEntry.findOne({ _id: req.params.id });
  if (!updateEntry) {
    return res.status(404).json({ message: "Journal entry not found" });
  }
  if (updateEntry.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  updateEntry.title = title || updateEntry.title;
  updateEntry.content = content || updateEntry.content;
  updateEntry.mood = mood || updateEntry.mood;
  updateEntry.tags = tags || updateEntry.tags;
  updateEntry.observationLocation =
    observationLocation || updateEntry.observationLocation;
  updateEntry.updatedAt = Date.now();

  await updateEntry.save();
  res.json({ entry: updateEntry });
});
exports.deleteJournalEntry = asyncHandler(async (req, res, next) => {
  const deleteEntry = await journalEntry.findOne({ _id: req.params.id });
  if (!deleteEntry) {
    return res.status(404).json({ message: "Journal entry not found" });
  }
  if (deleteEntry.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  await deleteEntry.deleteOne({ _id: req.params.id });
  res.json({ message: "Journal entry deleted" });
});
