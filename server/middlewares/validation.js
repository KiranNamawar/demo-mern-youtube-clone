import { fail } from "../utils/response.js";

export function validateBody(schema) {
  return (req, res, next) => {
    // check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return fail(res, "Request body is missing or empty", null, 400);
    }

    // parse request body
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return fail(res, "Validation failed", errors, 400);
    }

    // attach parsed data
    req.validatedBody = result.data;

    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    // parse request query
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return fail(res, "Query params invalid", errors, 400);
    }

    // attach parsed data
    req.validatedQuery = result.data;

    next();
  };
}
