import express from "express";
import morgan from "morgan";
import { connect } from "mongoose";
import { getEnvVar } from "./utils/env.js";
import authRouter from "./routes/auth.js";
import { fail } from "./utils/response.js";

// connect to database
const DB_URL = getEnvVar("DB_URL");
await connect(DB_URL);

// initialise express
const app = express();

// log request detail
app.use(morgan(":method :url :status - :response-time ms"));

// parse JSON body
app.use(express.json());

// healthcheck endpoint
app.get("/", (_, res) => {
  res.send("ok");
});

// auth routes
app.use("/auth", authRouter);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  return fail(res, "Something went wrong on the server!", null, 500);
});

// start server on PORT from Environment Variables (defaults to 3000)
const PORT = getEnvVar("PORT", 3000);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
