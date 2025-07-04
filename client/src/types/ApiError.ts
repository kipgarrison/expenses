export class ApiError extends Error {
  _message: string;
  _stackTrace: string;
  _requestId: string ;

  constructor(message: string, stackTrace: string, requestId: string) {
    super();
    this._message = message;
    this._stackTrace = stackTrace;
    this._requestId = requestId
  }

  get message(): string {
    return this._message;
  }

  get stackTrace(): string {
    return this._stackTrace;
  }

  get requestId(): string {
    return this._requestId;
  }
}
  