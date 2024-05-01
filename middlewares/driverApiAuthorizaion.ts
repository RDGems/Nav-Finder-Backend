// authorize the driver api's

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from "../utils/error/Apierror";
import { AuthRequest } from '../utils/allinterfaces';

interface modifiedRequest extends Request {
    data: JwtPayload;
}
const driverApiAuthorization = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Type assertion to tell TypeScript that req is of type modifiedRequest
    const accessMedium = req.headers['access-medium'];
    if (!accessMedium) {
        throw new ApiError(401, "No access-medium header provided");
    }
    const modifiedReq = req as modifiedRequest;
    const parts = (accessMedium as string).split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new ApiError(401, "Invalid access-medium header format");
    }
    const token = parts[1];
    try {

        // verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_DRIVER_TOKEN_SECRET!);
        modifiedReq.data = decodedToken as JwtPayload;
        if (decodedToken) {
            next();
        }
        else {
            throw new ApiError(401, "Please start the process again", []);
        }
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Unauthorized access", []);
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Unauthorized access", []);
        }
    }
}
export { driverApiAuthorization }