const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controllers");

// Routes
router.post("/", createProduct);           // POST /api/products
router.get("/", getAllProducts);           // GET /api/products
router.get("/:id", getProductById);        // GET /api/products/:id
router.put("/:id", updateProduct);         // PUT /api/products/:id
router.delete("/:id", deleteProduct);      // DELETE /api/products/:id

module.exports = router;