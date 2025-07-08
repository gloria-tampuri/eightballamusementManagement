// utils/pagination.js

/**
 * Calculate pagination metadata
 * @param {number} totalCount - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination metadata
 */
const calculatePaginationMeta = (totalCount, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    totalItems: totalCount,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null
  };
};

/**
 * Execute paginated query with metadata
 * @param {Object} Model - Mongoose model
 * @param {Object} filter - MongoDB filter object
 * @param {Object} sortObject - MongoDB sort object
 * @param {number} skip - Number of items to skip
 * @param {number} limit - Number of items to return
 * @param {string} selectFields - Fields to select
 * @returns {Object} Results and pagination metadata
 */
const executePaginatedQuery = async (Model, filter, sortObject, skip, limit, selectFields = '') => {
  try {
    const query = Model.find(filter).sort(sortObject).skip(skip).limit(limit);
    
    if (selectFields) {
      query.select(selectFields);
    }

    const [results, totalCount] = await Promise.all([
      query.lean(),
      Model.countDocuments(filter)
    ]);

    const currentPage = Math.floor(skip / limit) + 1;
    const paginationMeta = calculatePaginationMeta(totalCount, currentPage, limit);

    return {
      results,
      pagination: paginationMeta
    };
  } catch (error) {
    throw new Error(`Pagination query failed: ${error.message}`);
  }
};

module.exports = {
  calculatePaginationMeta,
  executePaginatedQuery
};