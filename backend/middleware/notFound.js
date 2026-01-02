/**
 * 404 Not Found Middleware
 * 
 * This middleware handles requests to routes that don't exist.
 * It should be placed after all route definitions but before error handler.
 * 
 * Usage: app.use(notFound) in server.js
 */

export const notFound = (req, res, next) => {
  // Create error object
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  
  // Pass to error handler
  next(error);
};
