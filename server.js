/********************************************************************************
*  WEB322 – Assignment 03
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: ______________________ Student ID: ______________ Date: ______________
*
********************************************************************************/

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("client-sessions");
const path = require("path");

const app = express();

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// PostgreSQL
const { sequelize } = require("./config/postgres");

// -----------------------------------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// session middleware
app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000, // 30 min
  })
);

// -----------------------------------------------------------------------------
// DATABASE CONNECTIONS
// -----------------------------------------------------------------------------

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// PostgreSQL test connection
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.log("PostgreSQL Error:", err));

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

// Landing page
app.get("/", (req, res) => {
  res.render("home"); // Make views/home.ejs
});

// About page
app.get("/about", (req, res) => {
  res.render("about"); // Make views/about.ejs
});

// Auth + Task routes
app.use("/", authRoutes);
app.use("/", taskRoutes);

// 404 Page (must be last)
app.use((req, res) => {
  res.status(404).render("404"); // Make views/404.ejs
});

// -----------------------------------------------------------------------------
// SERVER START
// -----------------------------------------------------------------------------

sequelize.sync().then(() => {
  console.log("PostgreSQL synced ✔");
});

module.exports = app;
