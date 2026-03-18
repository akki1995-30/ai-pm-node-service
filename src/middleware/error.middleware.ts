import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.error(err.message || "Unknown error", {
    stack: err.stack,
    method: req.method,
    path: req.path,
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    return res.status(400).json({
      message: field ? `${field} already exists` : "Duplicate entry",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token has expired" });
  }

  // Generic HTTP error (thrown with a status/statusCode property)
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    message: err.message || "Internal server error",
  });
};
