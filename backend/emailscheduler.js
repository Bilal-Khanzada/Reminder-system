// emailScheduler.js
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure nodemailer transporter (example using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email from your .env file
    pass: process.env.EMAIL_PASS, // Password or app password
  },
});

// Function to send a reminder email
async function sendReminderEmail(reminder) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: reminder.email,
    subject: `Reminder: ${reminder.occasion} on ${reminder.day}/${reminder.month}`,
    text: `Hi ${reminder.name},\n\nThis is a reminder for your event: ${reminder.occasion} scheduled on ${reminder.day}/${reminder.month}.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent for reminder ${reminder.id}: ${info.response}`);
    // Mark reminder as sent to avoid duplicate emails
    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { sent: true },
    });
  } catch (error) {
    console.error(`Error sending email for reminder ${reminder.id}:`, error);
  }
}

// Schedule a cron job to run every day at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log("Cron job running: Checking for reminders to send...");

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

  try {
    // Fetch reminders matching the current day and month that haven't been sent yet
    const reminders = await prisma.reminder.findMany({
      where: {
        day: currentDay,
        month: currentMonth,
        sent: false,
      },
    });

    // Send an email for each reminder
    for (const reminder of reminders) {
      await sendReminderEmail(reminder);
    }
  } catch (error) {
    console.error("Error fetching reminders for email sending:", error);
  }
});

// Export the function (if you need to trigger email sending manually from other parts)
module.exports = { sendReminderEmail };
