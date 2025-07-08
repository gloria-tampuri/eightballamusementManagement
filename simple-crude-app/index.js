const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/products", require("./routes/products.route"));

app.get("/", (req, res) => {
  res.send("Hello, World Server runs test node man!");
});

// Remove all the individual route handlers - they're now in the controller/routes

mongoose
  .connect(
    "mongodb+srv://gloriatampuri15:0ZnXVOAtBqiVJlZb@practicebackend.fvl3tx1.mongodb.net/?retryWrites=true&w=majority&appName=PracticeBackend"
  )
  .then(() => {
    console.log("Connected!");
    app.listen(4000, () => {
      console.log("Server is running on port 4000"); // Fixed: was saying 3000
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));