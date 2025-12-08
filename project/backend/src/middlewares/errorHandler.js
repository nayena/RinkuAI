/**
 * Central error handler middleware - returns JSON errors
 */
function errorHandler(err, _req, res, _next) {
  // Handle known errors with status codes
  if (err && err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Log unexpected errors
  console.error('Unhandled error:', err);

  // Return generic error
  res.status(500).json({ error: 'Internal Server Error' });
}

export default errorHandler;
