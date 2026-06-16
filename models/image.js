const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    width: Number,
    height: Number
  },
  { _id: false }
);

module.exports = mongoose.model('image',imageSchema, 'images');