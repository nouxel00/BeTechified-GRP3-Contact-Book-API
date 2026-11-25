# Contact Book API

A REST API to add, view, update and delete contacts. Built with Express 5 and SQLite by BeTechified Group 3.

## Requirements

- Node.js 22.13 or later (check with `node -v`)

SQLite is included in Node.js, so there is no database to install.

## Getting started

```bash
git clone https://github.com/nouxel00/BeTechified-GRP3-Contact-Book-API.git
cd BeTechified-GRP3-Contact-Book-API
npm install
npm start
```

The API runs at `http://127.0.0.1:3000/api/contacts`. Use `npm run dev` to restart the server whenever a file changes.

Contacts are saved in `data/contacts.db`, which is created the first time the server starts.

### Settings (optional)

Copy `.env.example` to `.env` to change these values:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
| `HOST` | `127.0.0.1` | Address the server listens on |
| `DB_FILE` | `data/contacts.db` | Location of the database file |

The API has no login. Keep `HOST` at `127.0.0.1` unless you want other machines to read and change the contacts.

## Endpoints

| Method | Route | Action | Success | Errors |
|---|---|---|---|---|
| POST | `/api/contacts` | Add a contact | 201 | 400, 409 |
| GET | `/api/contacts` | List all contacts | 200 | |
| GET | `/api/contacts/:id` | View one contact | 200 | 400, 404 |
| PUT | `/api/contacts/:id` | Update a contact | 200 | 400, 404, 409 |
| DELETE | `/api/contacts/:id` | Delete a contact | 204 | 400, 404 |

`PUT` replaces the whole contact, so send every field. An optional field that is left out becomes `null`.

## Contact fields

| Field | Required | Rules |
|---|---|---|
| `firstName` | Yes | 1 to 50 characters |
| `lastName` | Yes | 1 to 50 characters |
| `phone` | Yes | 8 to 15 digits, optional leading `+`, must be unique |
| `email` | No | Valid email address |
| `address` | No | Up to 200 characters |

The API sets `id`, `createdAt` and `updatedAt`. Spaces, dots, dashes and parentheses are removed from phone numbers, so `+226 70-11-22-33` and `+22670112233` are the same number.

## Example

Request:

```http
POST /api/contacts
Content-Type: application/json

{
  "firstName": "Awa",
  "lastName": "Traore",
  "phone": "+226 70-11-22-33",
  "email": "awa.traore@example.com",
  "address": "Ouagadougou"
}
```

Response, `201 Created`:

```json
{
  "id": 1,
  "firstName": "Awa",
  "lastName": "Traore",
  "phone": "+22670112233",
  "email": "awa.traore@example.com",
  "address": "Ouagadougou",
  "createdAt": "2026-11-25T21:23:55.474Z",
  "updatedAt": "2026-11-25T21:23:55.474Z"
}
```

## Errors

Every error has the same format. Validation errors also list each field to fix.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some fields are missing or invalid.",
    "details": [{ "field": "phone", "message": "phone is required." }]
  }
}
```

| Status | Code | Cause |
|---|---|---|
| 400 | `VALIDATION_ERROR` | A field is missing or invalid |
| 400 | `INVALID_BODY` | The body is missing or is not a JSON object |
| 400 | `INVALID_JSON` | The body is not valid JSON |
| 400 | `INVALID_ID` | The id is not a positive whole number |
| 400 | `BAD_REQUEST` | The request could not be processed |
| 404 | `CONTACT_NOT_FOUND` | No contact has this id |
| 404 | `ROUTE_NOT_FOUND` | The route does not exist |
| 409 | `PHONE_ALREADY_EXISTS` | Another contact has this phone number |
| 413 | `BODY_TOO_LARGE` | The body is larger than 100 KB |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

## Testing with Postman

1. Start the server with `npm start`.
2. In Postman, import `postman/contact-book.postman_collection.json`.
3. Open the collection and click **Run** to send the 10 requests in order.

The collection deletes the contact it creates, so you can run it as often as you like.

## Project structure

```
server.js                 starts the server
src/
  app.js                  configures Express
  config/db.js            opens SQLite and creates the table
  routes/                 maps each URL to a controller
  controllers/            handles requests and responses
  models/                 runs the SQL queries
  middlewares/            validation, request log, error handling
  utils/ApiError.js       error with a status and a code
postman/                  Postman collection
docs/                     presentation
```
