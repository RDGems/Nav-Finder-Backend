class ApiError extends Error {
    statusCode: number;
    errors?: any = [];
    success: boolean;
    data: any;

    constructor(
        statusCode: number = 500,
        message: string = "Something went wrong",
        errors?: any,
        stack?: string,
    ) {
        super(message);

        this.statusCode = statusCode;
        this.errors = errors || [];
        this.success = false;
        this.data = null;

        // Ensure the stack trace is correctly captured
        if (stack) {
            this.stack = stack;
        } else {
            // Capture the stack trace excluding the constructor call
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };