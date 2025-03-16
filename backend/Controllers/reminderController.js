const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// @desc Get all reminders
// @route GET /api/reminders
const getReminders = async (req, res, next) => {
  try {
    const reminders = await prisma.reminder.findMany();
    res.status(200).json(reminders);
  } catch (error) {
    next(error);
  }
};

// @desc Add a new reminder
// @route POST /api/reminders
const addReminder = async (req, res, next) => {
  try {
    const { name, occasion, day, month } = req.body;

    if (!name || !occasion || !day || !month) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReminder = await prisma.reminder.create({
      data: { name, occasion, day: Number(day), month },
    });

    res.status(201).json(newReminder);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a reminder
// @route DELETE /api/reminders/:id
const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.reminder.delete({
      where: { id },
    });

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReminders, addReminder, deleteReminder };
