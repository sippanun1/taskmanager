import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Extend Express's Request type to include our custom `userId` field
// This lets us do `req.userId` in any protected route
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// This middleware protects routes — only logged-in users can access them
// It checks for a valid JWT token in the Authorization header
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  // Step 1: Get the Authorization header
  // It should look like: "Bearer eyJhbGciOiJIUzI1NiJ9..."
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided. Please log in." });
    return;
  }

  // Step 2: Extract the token (remove the "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  // Step 3: Verify the token
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: "Invalid or expired token. Please log in again." });
    return;
  }

  // Step 4: Attach the userId to the request object
  // Now any route handler after this can access req.userId
  req.userId = decoded.userId;

  // Step 5: Call next() to pass control to the actual route handler
  next();
}
