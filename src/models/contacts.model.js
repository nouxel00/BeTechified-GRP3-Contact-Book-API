const db = require('../config/db');
const ApiError = require('../utils/ApiError');

const SQLITE_CONSTRAINT_UNIQUE = 2067;

const COLUMNS = `
  id,
  first_name AS firstName,
  last_name  AS lastName,
  phone,
  email,
  address,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

const statements = {
  findAll: db.prepare(`
    SELECT ${COLUMNS} FROM contacts
    ORDER BY last_name COLLATE NOCASE, first_name COLLATE NOCASE, id
  `),
  findById: db.prepare(`SELECT ${COLUMNS} FROM contacts WHERE id = ?`),
  insert: db.prepare(`
    INSERT INTO contacts (first_name, last_name, phone, email, address, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE contacts
    SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, updated_at = ?
    WHERE id = ?
  `),
  remove: db.prepare('DELETE FROM contacts WHERE id = ?'),
};

// The database guarantees that a phone number is unique. Turn that error into a 409.
function runUnique(statement, values) {
  try {
    return statement.run(...values);
  } catch (err) {
    if (err.errcode === SQLITE_CONSTRAINT_UNIQUE) {
      throw new ApiError(409, 'PHONE_ALREADY_EXISTS', 'A contact with this phone number already exists.');
    }
    throw err;
  }
}

function findAll() {
  return statements.findAll.all();
}

function findById(id) {
  return statements.findById.get(id);
}

function create({ firstName, lastName, phone, email, address }) {
  const now = new Date().toISOString();
  const result = runUnique(statements.insert, [firstName, lastName, phone, email, address, now, now]);
  return findById(result.lastInsertRowid);
}

// Returns undefined when the contact does not exist.
function update(id, { firstName, lastName, phone, email, address }) {
  const now = new Date().toISOString();
  runUnique(statements.update, [firstName, lastName, phone, email, address, now, id]);
  return findById(id);
}

// Returns false when the contact does not exist.
function remove(id) {
  return statements.remove.run(id).changes > 0;
}

module.exports = { findAll, findById, create, update, remove };
