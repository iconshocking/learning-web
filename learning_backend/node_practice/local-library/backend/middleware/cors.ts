/* Simple example CORS middleware for Express.js that approves any CORS requests from a pre-defined array of origins. */

import { NextFunction, Request, Response } from "express";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

export default function cors(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  next();
}
