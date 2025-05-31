class ApiResponse {
    constructor({ statusCode = 200, data = null, message = "Success!" } = {}) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data
    }
}

module.exports = ApiResponse;