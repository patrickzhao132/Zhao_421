const express = require('express');
const mongoose = require('mongoose');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use('/items', itemsRouter);

// Start the server
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});