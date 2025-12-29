import z from "zod";
import { fail } from "../utils/response.js";
import ErrorCodes from "../lib/error-codes.js";

export function validateBody(schema) {
  return (req, res, next) => {
    // check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return fail(
        res,
        ErrorCodes.VALIDATION_ERROR,
        "Request body is missing or empty",
        400
      );
    }

    // parse request body
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = z.treeifyError(result.error).properties;
      return fail(res, ErrorCodes.VALIDATION_ERROR, errors, 400);
    }

    // attach parsed data
    req.validatedBody = result.data;

    next();
  };
}

