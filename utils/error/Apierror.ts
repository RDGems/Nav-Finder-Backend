class ApiError extends Error {
    statusCode: number;
    errors?: any = [];
    success: boolean;
    data: any;
    constructor(
        statusCode: number = 500,
        message: string = "Something went wrong",
        errors?: any,
        stack = new Error().stack,
    ) {
        super(message);
        this.statusCode = statusCode,
            this.errors = errors,
            this.stack = stack,
            this.success = false,
            this.data = null
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor())
        }
    }
}

export { ApiError }