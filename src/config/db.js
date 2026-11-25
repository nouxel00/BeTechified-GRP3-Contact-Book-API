const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const file = process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'contacts.db');
if (file !== ':memory:') {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

const db = new DatabaseSync(file);

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL CHECK (length(first_name) BETWEEN 1 AND 50),
    last_name  TEXT NOT NULL CHECK (length(last_name) BETWEEN 1 AND 50),
    phone      TEXT NOT NULL UNIQUE,
    email      TEXT CHECK (length(email) <= 254),
    address    TEXT CHECK (length(address) <= 200),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

module.exports = db;
