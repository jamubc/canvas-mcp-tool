export declare class CanvasError extends Error {
    constructor(message: string);
}
export declare class CanvasAPIError extends CanvasError {
    statusCode: number;
    responseData?: any;
    constructor(message: string, statusCode: number, responseData?: any);
}
//# sourceMappingURL=errors.d.ts.map