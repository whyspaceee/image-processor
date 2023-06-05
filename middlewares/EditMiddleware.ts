import { NextFunction, Response } from "express";
import { Request } from "express-jwt";

export default function editMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tokenKey = String(req.auth?.key);
    const { imageId } = req.params;
    if (!imageId) {
      res.status(400).json({ error: "no filename given" });
    }
    if (!tokenKey) {
      res.status(400).json({ error: "invalid jwt" });
    }
    if (tokenKey !== imageId) {
      res.status(400).json({ error: "invalid jwt" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error });
  }
}
