
class ErrorHandler extends Error {
    constructor(statusCode = 500, message = "Internal Server Error", details = null) {
      super();
      this.statusCode = statusCode;
      this.message = message;
      this.details = details;
    }
}

const handleError = (err, res) => {
    const { statusCode, message, details } = err;
    const errorResponse = {
        status: "error",
        statusCode,
        message,
    }
    if (details) {
        errorResponse.details = details;
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = {
    ErrorHandler, handleError
}