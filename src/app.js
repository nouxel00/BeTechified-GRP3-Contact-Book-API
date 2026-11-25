const express = require('express');
const contactsRouter = require('./routes/contacts.routes');
const requestLogger = require('./middlewares/requestLogger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(requestLogger);
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
