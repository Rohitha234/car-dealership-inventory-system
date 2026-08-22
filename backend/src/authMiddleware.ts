import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Token is required"
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      message: "JWT_SECRET is not configured"
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
};

export default authenticateToken;