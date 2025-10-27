const { v4: uuidv4 } = require('uuid');

let products = [
  {
    id: uuidv4(),
    name: "Laptop",
    description: "A powerful machine for developers",
    price: 90000,
    category: "Electronics",
    inStock: true
  },
  {
    id: uuidv4(),
    name: "Book",
    description: "A guide to mastering Node.js",
    price: 1500,
    category: "Education",
    inStock: true
  }
];

module.exports = products;
