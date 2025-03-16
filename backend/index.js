const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const reminderRoutes = require("./routes/reminderRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const emailScheduler= require("./emailscheduler")

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reminders", reminderRoutes);

// Global Error Handling Middleware
app.use(errorMiddleware);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
