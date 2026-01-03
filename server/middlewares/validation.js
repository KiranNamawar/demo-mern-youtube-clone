import { Types } from "mongoose";
import z from "zod";
import ErrorCodes from "../lib/error-codes.js";
import { fail } from "../utils/response.js";

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

export function validateDocumentId(Model, paramsIdName = "id") {
  return async (req, res, next) => {
    try {
      const id = req.params[paramsIdName];

      // validate ObjectId
      if (!Types.ObjectId.isValid(id)) {
        return fail(
          res,
          ErrorCodes.INVALID_OBJECTID,
          "Invalid ObjectId format id: " + id,
          400
        );
      }

      // validate documentId
      const exists = await Model.exists({ _id: id });
      if (!exists) {
        return fail(
          res,
          ErrorCodes.NOT_FOUND,
          `No ${paramsIdName.replace("Id", "")} found with id: ${id}`,
          404
        );
      }

      req[paramsIdName] = id;

      next();
    } catch (err) {
      next(err);
    }
  };
}
