import jwt from "jsonwebtoken";
import { getEnvVar } from "./env.js";

const secret = getEnvVar("JWT_SECRET");
const expiry = "24h";

export function generateToken(data) {
  return jwt.sign(data, secret, { expiresIn: expiry });
}

export function parseToken(token) {
  return jwt.verify(token, secret);
}
