const { CONFLLICT } = require('../utils/statusCodes')

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLLICT;
  }
}

module.exports = ConflictError;