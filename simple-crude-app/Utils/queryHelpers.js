// utils/queryHelpers.js

/**
 * Build search filter object for MongoDB queries
 * @param {Object} params - Query parameters
 * @param {Array} searchFields - Fields to search in
 * @returns {Object} MongoDB filter object
 */
const buildSearchFilter = (params, searchFields = ['name', 'description']) => {
  const {
    search = '',
    category = '',
    minPrice = 0,
    maxPrice = Infinity,
    startDate = '',
    endDate = ''
  } = params;

  const searchFilter = {};

  // Text search across multiple fields
  if (search) {
    searchFilter.$or = searchFields.map(field => ({
      [field]: { $regex: search, $options: 'i' }
    }));
  }

  // Category filter
  if (category) {
    searchFilter.category = { $regex: category, $options: 'i' };
  }

  // Price range filter
  if (minPrice > 0 || maxPrice !== Infinity) {
    searchFilter.price = {};
    if (minPrice > 0) searchFilter.price.$gte = parseFloat(minPrice);
    if (maxPrice !== Infinity) searchFilter.price.$lte = parseFloat(maxPrice);
  }

  // Date range filter
  if (startDate || endDate) {
    searchFilter.createdAt = {};
    if (startDate) searchFilter.createdAt.$gte = new Date(startDate);
    if (endDate) searchFilter.createdAt.$lte = new Date(endDate);
  }

  return searchFilter;
};

/**
 * Build sort object for MongoDB queries
 * @param {Object} params - Query parameters
 * @param {Array} validSortFields - Valid fields for sorting
 * @returns {Object} MongoDB sort object
 */
const buildSortObject = (params, validSortFields = ['name', 'price', 'createdAt', 'updatedAt']) => {
  const { sortBy = 'createdAt', sortOrder = 'desc' } = params;
  const validSortOrders = ['asc', 'desc'];

  const sortObject = {};

  if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    // Default sort
    sortObject.createdAt = -1;
  }

  return sortObject;
};

/**
 * Parse and validate pagination parameters
 * @param {Object} query - Request query object
 * @returns {Object} Pagination parameters
 */
const parsePaginationParams = (query) => {
  const { page = 1, limit = 10 } = query;
  
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Max 100 items per page
  const skip = (pageNum - 1) * limitNum;

  return { pageNum, limitNum, skip };
};

/**
 * Build field selection string for MongoDB queries
 * @param {string} fields - Comma-separated field names
 * @returns {string} MongoDB select string
 */
const buildFieldSelection = (fields) => {
  if (!fields) return '';
  return fields.split(',').join(' ');
};

module.exports = {
  buildSearchFilter,
  buildSortObject,
  parsePaginationParams,
  buildFieldSelection
};