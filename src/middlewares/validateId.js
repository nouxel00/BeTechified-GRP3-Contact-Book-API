const ApiError = require('../utils/ApiError');

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!/^[1-9]\d*$/.test(req.params.id) || !Number.isSafeInteger(id)) {
    throw new ApiError(400, 'INVALID_ID', 'The contact id must be a positive whole number.');
  }
  req.contactId = id;
  next();
}

module.exports = validateId;
