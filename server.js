/********************************************************************************
*  WEB322 – Assignment 03
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy.
*
********************************************************************************/

require("dotenv").config();
const express = require("express");
const clientSessions = require("client-sessions");

const connectMongo = require("./config/mongoose");
const sequelize = require("./config/sequelize");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

async function createServer() {
  const app = express();

  // EJS View Engine
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/views");

  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));               // Main static folder
  app.use(express.static(__dirname + "/public"));  // Double-safe for Vercel

  // Sessions
  app.use(
    clientSessions({
      cookieName: "session",
      secret: process.env.SESSION_SECRET,
      duration: 30 * 60 * 1000,
      activeDuration: 10 * 60 * 1000,
    })
  );

  // User in locals
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });

  // ROUTES
  app.get("/", (req, res) => res.render("home"));
  app.use("/", authRoutes);
  app.use("/", taskRoutes);

  // Connect Databases FIRST (important for serverless)
  await connectMongo();
  await sequelize.authenticate();
  await sequelize.sync();

  console.log("All databases connected ✔");

  return app;
}

// Vercel expects an exported function OR object
module.exports = createServer();
