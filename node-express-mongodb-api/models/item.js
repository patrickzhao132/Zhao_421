const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  //async
  processed: {type: Boolean, default: false},
  processedAt: {type: Date, default: null}
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

