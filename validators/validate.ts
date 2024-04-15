import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ApiError } from '../utils/error/Apierror';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const firstError: ValidationError = errors.array()[0];
    if ('path' in firstError && typeof firstError.path === 'string') {
        // 422: Unprocessable Entity
        throw new ApiError(400, firstError.msg, []);
    } else {
        console.error('Unexpected error object:', firstError);
    }
};