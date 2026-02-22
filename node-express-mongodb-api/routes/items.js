/**
 * @swagger
 * tags:
 *   name: Items
 *   description: CRUD operations for items
 *
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1c2a9b2c3d4e5f6a7b8c9"
 *         name:
 *           type: string
 *           example: "Hammer"
 *         description:
 *           type: string
 *           example: "16oz claw hammer"
 *         processed:
 *           type: boolean
 *           example: false
 *         processedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *       required:
 *         - _id
 *         - name
 *         - processed
 *
 *     ItemCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Hammer"
 *         description:
 *           type: string
 *           example: "16oz claw hammer"
 *       required:
 *         - name
 *
 *     ItemUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Hammer (updated)"
 *         description:
 *           type: string
 *           example: "Updated description"
 *         processed:
 *           type: boolean
 *           example: true
 *
 *     Message:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Item deleted"
 */

const express = require('express');
const router = express.Router();
const Item = require('../models/item');



function delay(ms){
    return new Promise((resolve) => setTimeout(resolve,ms));
}


/**
 * @swagger
 * /items:
 *   post:
 *     tags: [Items]
 *     summary: Create a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemCreate'
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
// Create a new item
router.post('/', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /items:
 *   get:
 *     tags: [Items]
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * @swagger
 * /items/{id}:
 *   patch:
 *     tags: [Items]
 *     summary: Update an item by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemUpdate'
 *     responses:
 *       200:
 *         description: Updated item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
// Update an item
router.patch('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     tags: [Items]
 *     summary: Delete an item by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB item id
 *     responses:
 *       200:
 *         description: Item deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
// Delete an item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @swagger
 * /items/{id}/process:
 *   post:
 *     tags: [Items]
 *     summary: Process an item by id (sets processed fields)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB item id
 *     responses:
 *       200:
 *         description: Processed item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
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