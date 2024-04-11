import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/error/Apierror";
require("dotenv").config();
interface modifiedRequest extends Request {
    user: JwtPayload
}

const verifyToken = async (req: modifiedRequest, res: Response, next: NextFunction) => {
    // take token from cookies or headers.
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new ApiError(400, "Unauthorized access.");
    }
    // verification of token
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as JwtPayload;
        req.user = decodedToken;
        next();
    } catch (error: any) {
        next();
    }
}
export { verifyToken };