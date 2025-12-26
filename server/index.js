import express from "express";
import { connect } from "mongoose";
import { getEnvVar } from "./utils/env.js";

// connect to database
const DB_URL = getEnvVar("DB_URL");
connect(DB_URL);

// initialise express
const app = express();

// healthcheck endpoint
app.get("/", (_, res) => {
  res.send("ok");
});

// start server on PORT from Environment Variables (defaults to 3000)
const PORT = getEnvVar("PORT", 3000);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
