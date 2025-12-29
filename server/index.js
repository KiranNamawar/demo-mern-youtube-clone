import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connect } from "mongoose";
import { getEnvVar } from "./utils/env.js";
import authRouter from "./routes/auth.js";
import { fail } from "./utils/response.js";
import ErrorCodes from "./lib/error-codes.js";
import { authenticateUser } from "./middlewares/auth.js";
import apiRouter from "./routes/api.js";

// connect to database
const DB_URL = getEnvVar("DB_URL");
connect(DB_URL)
  .then(() => console.log("Connected to Database"))
  .catch(console.error);

// initialise express
const app = express();

// log request detail
app.use(morgan(":method :url :status - :response-time ms"));

// allow requests from all origins
app.use(cors());

// parse JSON body
app.use(express.json());

// healthcheck endpoint
app.get("/", (_, res) => {
  res.send("ok");
});

// auth routes
app.use("/auth", authRouter);

// protected routes
app.use("/api", authenticateUser, apiRouter);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  return fail(
    res,
    ErrorCodes.INTERNAL_SERVER_ERROR,
    "Something went wrong on the server!",
    500
  );
});

// start server on PORT from Environment Variables (defaults to 3000)
const PORT = getEnvVar("PORT", 3000);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
