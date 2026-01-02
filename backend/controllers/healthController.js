/**
 * Health Check Controller
 * 
 * This controller handles the health check endpoint.
 * It's used to verify that the server is running and responding.
 * 
 * Route: GET /api/health
 */

/**
 * Get server health status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getHealth = (req, res) => {
  // Return health status
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime() // Server uptime in seconds
  });
};
