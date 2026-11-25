require('dotenv').config({ quiet: true });

const app = require('./src/app');

const PORT = Number(process.env.PORT) || 3000;
// There is no login, so the API is only reachable from this machine by default.
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, (err) => {
  if (err) {
    console.error(`Could not start the server: ${err.message}`);
    process.exit(1);
  }
  console.log(`Contact Book API running at http://${HOST}:${PORT}/api/contacts`);
});
