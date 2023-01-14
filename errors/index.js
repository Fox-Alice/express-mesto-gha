const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const ForbiddenError = require('./ForbiddenError');
const UnauthorizedError = require('./UnauthorizedError');
const ConflictError = require('./ConflictError');

module.exports = {
  ConflictError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
};
