import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error/Apierror";
require("dotenv").config()

export interface myError extends Error {
    statusCode?: number;
    errors?: any[];
}

const errorHandler = (err: myError, req: Request, res: Response, next: NextFunction) => {
    console.log('Error received:', err); // Log the error received

    let message = "Something went wrong.";
    let statusCode = 500; // Default to 500

    if (!(err instanceof ApiError)) {
        if (err?.statusCode) {
            statusCode = err.statusCode;
        } else if (err instanceof mongoose.Error) {
            statusCode = 400;
        }

        message = err.message || "Something went wrong.";

        if (process.env.NODE_ENV == "DEV") {
            err = new ApiError(statusCode, message, err?.errors || [], err.stack);
        } else {
            if (message.includes(": ")) {
                message = message.split(": ")[2];
            }
            err = new ApiError(statusCode, message, [], err.stack);
        }
    }

    const response = {
        ...err,
        message: (err.message),
        ...(process.env.NODE_ENV === "DEV" ? { stack: err.stack } : {}),
    }

    return res.status(err.statusCode!).json(response);
}
export { errorHandler };
