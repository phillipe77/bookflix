const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const updates = [
  { title: "Lucas", coverUrl: "http://localhost:5000/uploads/clean-code.jpg" },
  { title: "Atos", coverUrl: "http://localhost:5000/uploads/pragmatic-programmer.jpg" },
  { title: "Romanos", coverUrl: "http://localhost:5000/uploads/1984.jpg" },
  { title: "Efésios", coverUrl: "http://localhost:5000/uploads/design-patterns.jpg" },
  { title: "Filipenses", coverUrl: "http://localhost:5000/uploads/to-kill-a-mockingbird.jpg" },
  { title: "Apocalipse", coverUrl: "http://localhost:5000/uploads/to-kill-a-mockingbird.jpg" },
];

const updateBooks = async () => {
  try {
    for (const update of updates) {
      const result = await Book.updateOne(
        { title: { $regex: new RegExp(`^${update.title}$`, 'i') } }, 
        { $set: { coverUrl: update.coverUrl } }
      );
      console.log(`Atualizando livro: ${update.title}`);
      console.log(`Resultado da atualização:`, result);
    }
    console.log("Livros atualizados com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar livros:", err);
  } finally {
    mongoose.connection.close();
  }
};

updateBooks();
