const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Adjust the type as needed based on your use case
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  path: {
    type: String, // You can make it optional or remove it if not needed
    required: true,
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
