import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export const authorize = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    // Authentication must happen first
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Check whether user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};