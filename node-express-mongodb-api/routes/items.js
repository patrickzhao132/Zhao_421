const express = require('express');
const router = express.Router();
const Item = require('../models/item');

function delay(ms){
    return new Promise((resolve) => setTimeout(resolve,ms));
}

// Create a new item
router.post('/', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.patch('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//asnychronous call delay 
router.post("/:id/process", async(req,res)=>{
    try {
        const item = await Item.findById(req.params.id);
        if(!item){
            return res.status(404).json({message: "Item Not Found"});
        }
        await delay (2000);
        item.processed = true;
        item.processedAt = new Date();

        const saved = await item.save();
        res.json({message : "Item Processed", item : saved});
    } catch (err){
        res.status(400).json({message : err.message});
    }
    //2 second delay
    

})
module.exports = router;