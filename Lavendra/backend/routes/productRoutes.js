import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// New route to create a package
productRouter.post('/packages', async (req, res) => {
  try {
    const newPackage = new Product({
      name: req.body.name,
      slug: req.body.slug,
      category: 'Packages', // Set category to 'Packages'
      image: req.body.image,
      price: req.body.price,
      countInStock: req.body.countInStock,
      brand: req.body.brand,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      description: req.body.description,
    });

    const savedPackage = await newPackage.save();
    res.status(201).send(savedPackage); // Return the saved package
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error creating package', error: error.message });
  }
});

export default productRouter;
