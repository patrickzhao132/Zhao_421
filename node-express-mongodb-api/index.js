const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase");
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .catch((err) => console.error("Mongoose connect() failed:", err));
// Routes
const itemsRouter = require('./routes/items');
app.use('/items', itemsRouter);

// Start the server
app.get("/", (req, res) => {
  res.send("API is running");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});