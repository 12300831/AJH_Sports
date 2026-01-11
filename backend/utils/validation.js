/**
 * Validation Utilities
 * Input validation and sanitization for security
 */

// Valid role values (normalized)
export const VALID_ROLES = ['Admin', 'Coach', 'User', 'Guest', 'Moderator'];

// Valid status values (normalized)
export const VALID_STATUSES = ['Active', 'Inactive', 'Pending', 'Suspended', 'Banned'];

/**
 * Normalize role value (case-insensitive)
 */
export function normalizeRole(role) {
  if (!role || typeof role !== 'string') return 'User';
  const normalized = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  return VALID_ROLES.includes(normalized) ? normalized : 'User';
}

/**
 * Normalize status value (case-insensitive)
 */
export function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'Active';
  const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return VALID_STATUSES.includes(normalized) ? normalized : 'Active';
}

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

