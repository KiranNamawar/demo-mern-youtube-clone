import ErrorCodes from "../lib/error-codes.js";
import { parseToken } from "../utils/jwt.js";
import { fail } from "../utils/response.js";

export async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return fail(res, ErrorCodes.INVALID_TOKEN, "Access Token required", 401);
  }
  const token = authHeader.substring(7); // Remove "Bearer "
  try {
    req.user = parseToken(token);
    next();
  } catch (err) {
    fail(res, ErrorCodes.INVALID_TOKEN, "Invalid or expired token", 401);
  }
}