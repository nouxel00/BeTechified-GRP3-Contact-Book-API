const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, 'ROUTE_NOT_FOUND', `Cannot ${req.method} ${req.path}.`));
}

// Converts any error into an ApiError that is safe to send to the client.
function toApiError(err) {
  if (err instanceof ApiError) return err;
  if (err.type === 'entity.parse.failed') {
    return new ApiError(400, 'INVALID_JSON', 'The request body is not valid JSON.');
  }
  if (err.type === 'entity.too.large') {
    return new ApiError(413, 'BODY_TOO_LARGE', 'The request body is too large.');
  }
  if (err.status >= 400 && err.status < 500) {
    return new ApiError(err.status, 'BAD_REQUEST', 'The request could not be processed.');
  }
  return new ApiError(500, 'INTERNAL_ERROR', 'Something went wrong on the server.');
}

// Express recognises an error handler by its four parameters.
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const { status, code, message, details } = toApiError(err);
  if (status >= 500) console.error(err);

  const error = { code, message };
  if (details) error.details = details;
  res.status(status).json({ error });
}

module.exports = { notFound, errorHandler };
