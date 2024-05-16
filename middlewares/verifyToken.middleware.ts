import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/error/Apierror";
require("dotenv").config();

interface modifiedRequest extends Request {
    user: JwtPayload;
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // Type assertion to tell TypeScript that req is of type modifiedRequest
    const modifiedReq = req as modifiedRequest;

    // take token from cookies or headers.
    const token = modifiedReq.cookies?.accessToken || modifiedReq.headers.authorization?.split("Bearer ")[1];
    if (!token) {
        // throw new ApiError(401, "Unauthorized access", []);
        return res.status(401).json({
            "success": false,
            "message": "Unauthorized access"
        })
    }

    // verification of token
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as JwtPayload;
        modifiedReq.user = decodedToken;
        next();
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                "success": false,
                "message": "Unauthorized access"
            });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                "success": false,
                "message": "Unauthorized access"
            });
        }
    }
}

export { verifyToken };