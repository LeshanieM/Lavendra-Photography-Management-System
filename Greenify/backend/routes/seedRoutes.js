import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import e from 'express';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany({}); //remove changed as deleteMany - new version
  const createdProducts = await Product.insertMany(data.products);
  // res.send({ createdProducts });

  await User.deleteMany({}); //remove changed as deleteMany - new version
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts, createdUsers });
});

export default seedRouter;
