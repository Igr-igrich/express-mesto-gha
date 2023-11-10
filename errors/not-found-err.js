const { SUCCESSCREATED, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/statusCodes')

// class UnauthorizedError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = UNAUTHORIZED;
//   }
// }

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

// class ForbiddenError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = FORBIDDEN_403;
//   }
// }

// class ConflictError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = CONFLICT_409;
//   }
// }

// class BadRequestError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = BAD_REQUEST_400;
//   }
// }

module.exports = NotFoundError;