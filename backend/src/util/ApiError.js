class ApiError extends Error {
  constructor(
    statusCode,
    errors = [],
    message = "somthing went wrong",
    stack = "",
  ) {
    super(message);
    ((this.statusCode = statusCode),
      (this.message = message),
      (this.data = null),
      (this.success = false));
    this.errors = errors;

    if (this.stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.stack); // Error.captureStackTrace(this,this.constructor)
    }
  }
}

export { ApiError };
