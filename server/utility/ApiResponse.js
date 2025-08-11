class ApiResponse {
    constructor({ statusCode = 200, message = 'Success', data = {} }) {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.timeStamp = new Date();
    }
}

export default ApiResponse;
