import z from "zod";
import { fail } from "../utils/response.js";
import ErrorCodes from "../lib/error-codes.js";
import { Types } from "mongoose";

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

export function validateObjectId(paramsIdName = "id") {
  return (req, res, next) => {
    const id = req.params[paramsIdName];
    if (!Types.ObjectId.isValid(id)) {
      return fail(res, ErrorCodes.INVALID_OBJECTID, "Invalid ObjectId", 400);
    }
    req.validatedId = id;
    next();
  };
}