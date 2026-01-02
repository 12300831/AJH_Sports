/**
 * Error Handling Middleware
 * 
 * This middleware catches any errors that occur in route handlers
 * and sends a formatted error response to the client.
 * 
 * Usage: Add this as the last middleware in server.js
 */

export const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error('Error:', err);

  // Send error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    // Only show stack trace in development mode
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
