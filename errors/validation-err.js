const { BAD_REQUEST } = require('../utils/statusCodes');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = ValidationError;