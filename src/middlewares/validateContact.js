const ApiError = require('../utils/ApiError');

const NAME_MAX = 50;
const PHONE_MAX = 30;
const EMAIL_MAX = 254;
const ADDRESS_MAX = 200;
const PHONE_PATTERN = /^\+?\d{8,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

// Checks the request body and keeps only the fields we know about.
function validateContact(req, res, next) {
  const body = req.body;

  // In Express 5, req.body is undefined when no JSON body is sent.
  if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiError(400, 'INVALID_BODY', 'The request body must be a JSON object.');
  }

  const errors = [];

  function readText(field, { required, max }) {
    const value = body[field];
    if (isBlank(value)) {
      if (required) errors.push({ field, message: `${field} is required.` });
      return null;
    }
    if (typeof value !== 'string') {
      errors.push({ field, message: `${field} must be text.` });
      return null;
    }
    const text = value.trim();
    if (text.length > max) {
      errors.push({ field, message: `${field} must be at most ${max} characters.` });
      return null;
    }
    return text;
  }

  const firstName = readText('firstName', { required: true, max: NAME_MAX });
  const lastName = readText('lastName', { required: true, max: NAME_MAX });
  let phone = readText('phone', { required: true, max: PHONE_MAX });
  const email = readText('email', { required: false, max: EMAIL_MAX });
  const address = readText('address', { required: false, max: ADDRESS_MAX });

  if (phone !== null) {
    // "+226 70-11-22-33" and "+22670112233" are the same number.
    phone = phone.replace(/[\s().-]/g, '');
    if (!PHONE_PATTERN.test(phone)) {
      errors.push({ field: 'phone', message: 'phone must contain 8 to 15 digits, with an optional leading +.' });
    }
  }

  if (email !== null && !EMAIL_PATTERN.test(email)) {
    errors.push({ field: 'email', message: 'email is not a valid email address.' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Some fields are missing or invalid.', errors);
  }

  req.contactData = { firstName, lastName, phone, email, address };
  next();
}

module.exports = validateContact;
