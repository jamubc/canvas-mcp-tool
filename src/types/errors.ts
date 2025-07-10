export class CanvasError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CanvasError';
  }
}

export class CanvasAPIError extends CanvasError {
  statusCode: number;
  responseData?: any;

  constructor(message: string, statusCode: number, responseData?: any) {
    super(message);
    this.name = 'CanvasAPIError';
    this.statusCode = statusCode;
    this.responseData = responseData;
  }
}