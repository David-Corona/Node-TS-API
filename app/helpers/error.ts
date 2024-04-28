import { Response } from 'express';

export class ErrorHandler extends Error {
    statusCode: number;
    message: string;
    details?: string;
    
    constructor(statusCode = 500, message = "Internal Server Error", details?: string) {
      super();
      this.statusCode = statusCode;
      this.message = message;
      this.details = details;
    }
}

export const handleError = (err: ErrorHandler, res: Response) => {
    const { statusCode = 500, message = "Server Error", details } = err;
    const errorResponse: any = {
        status: "error",
        statusCode,
        message,
    }
    if (details) {
        errorResponse.details = details;
    }

    res.status(statusCode).json(errorResponse);
};