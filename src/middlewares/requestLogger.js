// Logs one line per request. Contact details are never logged.
function requestLogger(req, res, next) {
  const start = Date.now();
  const path = req.originalUrl.split('?')[0];

  res.on('finish', () => {
    console.log(`${new Date().toISOString()} ${req.method} ${path} ${res.statusCode} ${Date.now() - start}ms`);
  });

  next();
}

module.exports = requestLogger;
