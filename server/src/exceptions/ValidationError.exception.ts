export class ValidationErrorException extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
