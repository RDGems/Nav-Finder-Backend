class ApiResponse {
    data: any;
    message: string;
    success: boolean;

    constructor(statusCode: number = 200, data: any = {}, message: string = "Success") {
        this.data = data;
        this.message = message;
        this.success = true;
    }
}

export { ApiResponse }