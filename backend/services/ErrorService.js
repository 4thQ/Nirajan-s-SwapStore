export class ErrorService extends Error {
  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static notFoundError(message = "Not Found") {
    return new ErrorService(404, message);
  }

  static alreadyExistError(message = "Allready Exist") {
    return new ErrorService(409, message);
  }

  static unAuthorizedError(message = "UnAuthorized") {
    return new ErrorService(401, message);
  }

  static badRequestError(message = "Bad Request") {
    return new ErrorService(400, message);
  }

  static forbiddenError(message = "Not Allowed") {
    return new ErrorService(403, message);
  }
}
