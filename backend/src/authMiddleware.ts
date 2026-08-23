// Import Express types for request, response, and middleware handling
import { Request, Response, NextFunction } from "express";

// Import JWT library for verifying authentication tokens
import jwt from "jsonwebtoken";

// Middleware to verify the JWT token before allowing access to protected routes
const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the Authorization header from the incoming request
  const authHeader = req.headers.authorization;

  // Extract the token from the "Bearer <token>" format
  const token = authHeader && authHeader.split(" ")[1];

  // Reject the request if no token is provided
  if (!token) {
    return res.status(401).json({
      message: "Access denied. Token is required"
    });
  }

  // Get the JWT secret key from environment variables
  const jwtSecret = process.env.JWT_SECRET;

  // Stop authentication if the JWT secret is not configured
  if (!jwtSecret) {
    return res.status(500).json({
      message: "JWT_SECRET is not configured"
    });
  }

  try {
    // Verify the token and decode the authenticated user's information
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the decoded user information to the request for later use
    (req as any).user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Reject the request if the token is invalid or has expired
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
};

// Export the authentication middleware for use in protected routes
export default authenticateToken;