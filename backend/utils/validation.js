/**
 * Validation Utilities
 * Input validation and sanitization for security
 */

// Valid role values (normalized)
// Note: Coaches are stored in the coaches table, not as user roles
export const VALID_ROLES = ['Admin', 'User'];

// Valid sports values (normalized)
export const VALID_SPORTS = ['Tennis', 'Table Tennis'];

/**
 * Normalize role value (case-insensitive)
 */
export function normalizeRole(role) {
  if (!role || typeof role !== 'string') return 'User';
  const normalized = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  return VALID_ROLES.includes(normalized) ? normalized : 'User';
}

/**
 * Normalize sports value (case-insensitive)
 */
export function normalizeSports(sports) {
  if (!sports || typeof sports !== 'string') return 'Tennis';
  // Handle variations
  const normalized = sports.trim();
  if (normalized.toLowerCase() === 'table tennis' || normalized.toLowerCase() === 'tabletennis') {
    return 'Table Tennis';
  }
  if (normalized.toLowerCase() === 'tennis') {
    return 'Tennis';
  }
  return VALID_SPORTS.includes(normalized) ? normalized : 'Tennis';
}

// Keep normalizeStatus for backward compatibility (maps to sports)
export function normalizeStatus(status) {
  // For backward compatibility, map old status values
  return normalizeSports(status);
}

// Keep VALID_STATUSES for backward compatibility
export const VALID_STATUSES = ['Tennis', 'Table Tennis'];

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate username format (alphanumeric, underscore, hyphen, 3-30 chars)
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username.trim());
}

/**
 * Sanitize search string (prevent SQL injection attempts)
 */
export function sanitizeSearch(search) {
  if (!search || typeof search !== 'string') return '';
  // Remove potentially dangerous characters but allow normal search
  return search.trim().replace(/[<>'"\\]/g, '').substring(0, 100);
}

/**
 * Validate and sanitize pagination parameters
 */
export function validatePagination(page, limit) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 per page
  return { page: pageNum, limit: limitNum };
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
export function validateDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

