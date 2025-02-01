import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import e from 'express';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({});//remove changed as deleteMany - new version
  const createdProducts = await Product.insertMany(data.products);
  res.send({ createdProducts });
});

export default seedRouter;
