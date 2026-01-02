/**
 * Request Logger Middleware
 * 
 * This middleware logs all incoming requests with their method, URL, and timestamp.
 * Useful for debugging and monitoring API usage.
 * 
 * Usage: app.use(logger) in server.js
 */

export const logger = (req, res, next) => {
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Log request details
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Continue to next middleware
  next();
};
