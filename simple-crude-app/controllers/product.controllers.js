const Product = require("../modules/product.model");

// Create a new product
const createProduct = async (req, res) => {
  try {
    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ name: req.body.name });
    
    if (existingProduct) {
      return res.status(400).json({ 
        error: "Product with this name already exists" 
      });
    }
    
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// // Get all products
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return res.status(500).send("Internal Server Error");
//   }
// };

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send("Internal Server Error");
  }
};



// Get all products with sorting, searching, and pagination
const getAllProducts = async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, sort, search } = req.query;
    
    // Create a query object for filtering
    const query = {};
    
    // Add search functionality (case-insensitive partial match on name)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Create sort object
    let sortOptions = {};
    if (sort) {
      const sortFields = sort.split(',');
      for (const field of sortFields) {
        const sortOrder = field.startsWith('-') ? -1 : 1;
        const fieldName = field.replace(/^-/, '');
        sortOptions[fieldName] = sortOrder;
      }
    } else {
      // Default sorting (by createdAt descending if no sort specified)
      sortOptions = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Get total count for pagination info
    const total = await Product.countDocuments(query);
    
    // Prepare response with pagination metadata
    const response = {
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};