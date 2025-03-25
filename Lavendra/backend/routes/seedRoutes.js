import express from 'express';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();
try {
  seedRouter.get('/', async (req, res) => {
    await Product.deleteMany({}); //remove changed as deleteMany - new version
    const createdProducts = await Product.insertMany(data.products);
    // res.send({ createdProducts });

    await User.deleteMany({}); //remove changed as deleteMany - new version
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdProducts, createdUsers });
  });
} catch (error) {
  console.error('Error seeding data:', error);
  res.status(500).send({ message: 'Error seeding data' });
}

export default seedRouter;
