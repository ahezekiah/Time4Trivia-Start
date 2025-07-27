/**
 * Helper functions for views and security
 */

/**
 * Check if user is admin based on session data
 * @param {Object} user - User object from session
 * @returns {boolean} True if user is admin
 */
exports.isAdmin = function(user) {
    return user && user.roles && user.roles.includes('admin');
};

/**
 * Validate and sanitize input to prevent XSS
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
exports.sanitizeInput = function(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Validate numeric input
 * @param {any} input - Input to validate
 * @returns {number|null} Valid number or null
 */
exports.validateNumeric = function(input) {
    const num = parseInt(input, 10);
    return isNaN(num) ? null : num;
};

/**
 * Rate limiting helper (simple in-memory store)
 */
const rateLimitStore = new Map();

exports.rateLimit = function(identifier, maxRequests = 5, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitStore.has(identifier)) {
        rateLimitStore.set(identifier, []);
    }
    
    const requests = rateLimitStore.get(identifier).filter(time => time > windowStart);
    
    if (requests.length >= maxRequests) {
        return false; // Rate limit exceeded
    }
    
    requests.push(now);
    rateLimitStore.set(identifier, requests);
    
    return true; // Request allowed
};
