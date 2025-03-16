# Email Reminder System

This project is an automated email reminder system that allows users to create reminders with a name, email, occasion, and date. A daily scheduled task checks for any reminders due that day and sends an email automatically using **node-cron** and **nodemailer**.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Setup & Installation](#setup--installation)
- [Prisma Schema](#prisma-schema)
- [Backend Code](#backend-code)
  - [Environment Variables (`.env`)](#environment-variables-env)
  - [Server (`server.js`)](#server-serverjs)
  - [Email Scheduler (`emailScheduler.js`)](#email-scheduler-emailschedulerjs)
  - [Reminder Controller (`reminderController.js`)](#reminder-controller-remindercontrollerjs)
- [Frontend (Optional)](#frontend-optional)
  - [React App Setup](#react-app-setup)
  - [Example Frontend Code](#example-frontend-code)
- [Running the App](#running-the-app)
- [Notes](#notes)

---

## Overview

1. **User submits a reminder** with:
   - Name
   - Email
   - Occasion (Birthday, Anniversary, etc.)
   - Day and Month

2. **Data is stored** in a PostgreSQL database via **Prisma**.

3. **Daily Cron Job** (via **node-cron**) checks for reminders matching the current day and month:
   - Sends an **email** using **nodemailer**.
   - Marks the reminder as **sent** to avoid duplicates.

---

## Tech Stack

- **Backend:** Node.js, Express, Prisma, PostgreSQL, node-cron, nodemailer
- **Frontend (optional):** React
- **Environment Management:** dotenv

---

## File Structure

A typical layout might look like this:

