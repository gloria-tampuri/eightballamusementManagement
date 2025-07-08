// utils/validation.js

/**
 * Validate and sanitize query parameters
 * @param {Object} query - Request query object
 * @param {Object} options - Validation options
 * @returns {Object} Validated and sanitized parameters
 */
const validateQueryParams = (query, options = {}) => {
  const {
    allowedSortFields = ['name', 'price', 'createdAt', 'updatedAt'],
    allowedSearchFields = ['name', 'description'],
    maxLimit = 100,
    defaultLimit = 10
  } = options;

  const validatedParams = {};

  // Pagination validation
  validatedParams.page = Math.max(1, parseInt(query.page) || 1);
  validatedParams.limit = Math.max(1, Math.min(maxLimit, parseInt(query.limit) || defaultLimit));

  // Search validation
  validatedParams.search = query.search ? query.search.trim() : '';
  
  // Sort validation
  validatedParams.sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  validatedParams.sortOrder = ['asc', 'desc'].includes(query.sortOrder) ? query.sortOrder : 'desc';

  // Filter validation
  validatedParams.category = query.category ? query.category.trim() : '';
  validatedParams.minPrice = parseFloat(query.minPrice) || 0;
  validatedParams.maxPrice = parseFloat(query.maxPrice) || Infinity;

  // Date validation
  if (query.startDate) {
    const startDate = new Date(query.startDate);
    validatedParams.startDate = isNaN(startDate.getTime()) ? '' : startDate.toISOString();
  }

  if (query.endDate) {
    const endDate = new Date(query.endDate);
    validatedParams.endDate = isNaN(endDate.getTime()) ? '' : endDate.toISOString();
  }

  return validatedParams;
};

/**
 * Validate required fields
 * @param {Object} data - Data to validate
 * @param {Array} requiredFields - Required field names
 * @returns {Object} Validation result
 */
const validateRequiredFields = (data, requiredFields) => {
  const errors = [];

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  validateQueryParams,
  validateRequiredFields,
  sanitizeString
};