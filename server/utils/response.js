import ErrorCodes from "../lib/error-codes.js";

export function ok(res, message, data = null, status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function fail(
  res,
  code = ErrorCodes.INTERNAL_SERVER_ERROR,
  error = null,
  status = 500
) {
  return res.status(status).json({ success: false, code, error });
}
