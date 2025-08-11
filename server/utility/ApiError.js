class ApiError extends Error {
    constructor({
        statusCode = 401,
        message = 'Something went wrong',
        error = '',
    }) {
        super();
        this.success = false;
        this.message = message;
        this.data = null;
        this.statusCode = statusCode;
        this.error = error;
    }
}

export default ApiError;
