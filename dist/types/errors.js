export class CanvasError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CanvasError';
    }
}
export class CanvasAPIError extends CanvasError {
    statusCode;
    responseData;
    constructor(message, statusCode, responseData) {
        super(message);
        this.name = 'CanvasAPIError';
        this.statusCode = statusCode;
        this.responseData = responseData;
    }
}
//# sourceMappingURL=errors.js.map