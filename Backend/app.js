if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const { cloudinary } = require('./cloudinary/index.js');

const ExpressError = require("./models/ExpressError");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

// ========== Mongoose Connection ==========
// =========================================
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/places";
mongoose.connect(dbUrl).catch((error) => console.log(error));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

// ========== APP SETUP ==========
// ===============================
const app = express();

app.use(express.urlencoded({ extended: true })); // Parse Body Data
app.use(express.json()); // Parse incoming JSON body data
app.use(cors());

// ========== ROUTES ==========
// ============================
// <<< ----- PLACES ------- >>>
app.use("/api/places", placesRoutes);

// <<< ------ USERS ------- >>>
app.use("/api/users", usersRoutes);

// <<< -- ERROR HANDLERS -- >>>
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use( async (error, req, res, next) => {
  const { statusCode = 500 } = error;
  if(req.file){
    await cloudinary.uploader.destroy(req.file.filename);
  };
  !error.message ? (error.message = "Something Went Wrong") : null;
  res.headerSent ? next(error) : res.status(statusCode).json(error.message);
});

// ========== SERVER ==========
// ============================
app.listen(5000, () => {
  console.log("Server Listening on Port 5000");
});
