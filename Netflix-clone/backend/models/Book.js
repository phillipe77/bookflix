const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  category: String,
  pdfUrl: { type: String, required: true },
  coverUrl: { type: String, required: true }, // Certifique-se de que este campo está definido
});

module.exports = mongoose.model('Book', bookSchema);
