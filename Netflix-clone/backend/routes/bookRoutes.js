const express = require('express');
const multer = require('multer');
const Book = require('../models/Book');
const router = express.Router();

// Configuração do multer para upload de PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Listar todos os livros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter detalhes de um livro específico
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar novo livro (com upload de PDF)
router.post('/', upload.single('pdf'), async (req, res) => {
  const { title, author, description, category } = req.body;
  const pdfUrl = req.file.path;

  try {
    const newBook = new Book({
      title,
      author,
      description,
      category,
      pdfUrl
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Baixar PDF
router.get('/download/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.download(book.pdfUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
