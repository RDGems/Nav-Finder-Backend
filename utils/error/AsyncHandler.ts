import { Request, Response, RequestHandler, NextFunction } from "express";

const asyncHandler = (requestHandler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => { next(err) })
    }
}
export { asyncHandler };