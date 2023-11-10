const { BAD_REQUEST } = require('../utils/statusCodes')

class CastError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = CastError;