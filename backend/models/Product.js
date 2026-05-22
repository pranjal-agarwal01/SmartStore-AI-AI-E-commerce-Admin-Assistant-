const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    default: '',
  },
  seoTags: {
    type: [String],
    default: [],
  },
  marketingCaption: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  salesCount: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
