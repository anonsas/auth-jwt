export class ApiErrorException extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiErrorException(401, "Not authorized. Please log in");
  }

  static BadRequest(message: string, errors?: string[]) {
    return new ApiErrorException(400, message, (errors = []));
  }
}
