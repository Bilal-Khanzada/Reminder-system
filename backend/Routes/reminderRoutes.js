const express = require("express");
const { getReminders, addReminder, deleteReminder } = require("../Controllers/reminderController");

const router = express.Router();

router.get("/", getReminders); // Get all reminders
router.post("/", addReminder); // Add a new reminder
router.delete("/:id", deleteReminder); // Delete a reminder

module.exports = router;
