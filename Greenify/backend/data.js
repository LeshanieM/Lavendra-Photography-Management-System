import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],

  products: [
    {
      //_id: '1',
      name: 'Rose Plant',
      slug: 'rose-plant',
      category: 'Plants',
      image: '/images/p1.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Rose',
      rating: 4.5,
      numReviews: 10,
      description: 'A rose is a flowering plant in the rose family.',
    },

    {
      // _id: '2',
      name: 'Banyan Plant',
      slug: 'banyan-plant',
      category: 'Plants',
      image: '/images/p2.jpg',
      price: 100,
      countInStock: 0,
      brand: 'Banyan',
      rating: 4.4,
      numReviews: 10,
      description: 'A Banyan is a tree in the Banyan family.',
    },

    {
      // _id: '3',
      name: 'Mango Plant',
      slug: 'mango-plant',
      category: 'Plants',
      image: '/images/p3.jpg',
      price: 110,
      countInStock: 10,
      brand: 'Mango',
      rating: 4.5,
      numReviews: 10,
      description: 'A Mango is a fruit in the Mango family.',
    },

    {
      //  _id: '4',
      name: 'Orchid Plant',
      slug: 'orchid-plant',
      category: 'Flowers',
      image: '/images/f1.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Orchid',
      rating: 4.5,
      numReviews: 10,
      description: 'A Orchid is a flowering plant in the Orchid family.',
    },
  ],
};

export default data;
