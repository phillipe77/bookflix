const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const books = [
  {
    title: "Lucas",
    author: "Hernandes Dias Lopes",
    description: "Jesus, o Homem perfeito.",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/lucas.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/lucas.jpg"
  },
  {
    title: "Atos",
    author: "Hernandes Dias Lopes",
    description: "A ação do Espirito Santo na vida da Igreja",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/atos.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/atos.jpg"
  },
  {
    title: "Romanos",
    author: "Hernandes Dias Lopes",
    description: "O Evangelho segundo Paulo",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/romanos.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/romanos.jpg"
  },
  {
    title: "Efesios",
    author: "Hernandes Dias Lopes",
    description: "Igreja, a noiva gloriosa de Cristo",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/efesios.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/efesios.jpg"
  },
  {
    title: "Filipenses",
    author: "Hernandes Dias Lopes",
    description: "A alegria triunfante no meio das provas",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/filipenses.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/filipenses.jpg"
  },
  {
    title: "Apocalipse",
    author: "Hernandes Dias Lopes",
    description: "O Futuro Chegou",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/apocalipse.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/apocalipse.jpg"
  },
  {
    title: "1 Timoteo",
    author: "Hernandes Dias Lopes",
    description: "O pastor, sua vida e obra",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/1timoteo.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/1timoteo.jpg"
  },
  {
    title: "2 Timoteo",
    author: "Hernandes Dias Lopes",
    description: "O testamento de Paulo a Igreja",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/timoteo.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/timoteo.jpg"
  },
  {
    title: "Tiago",
    author: "Hernandes Dias Lopes",
    description: "Transformando provas em triunfo",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/tiago.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/tiago.jpg"
  },
  {
    title: "Galátas",
    author: "Hernandes Dias Lopes",
    description: "A carta da Liberdade Cristã",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/galatas.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/galatas.jpg"
  },
  {
    title: "Hebreus",
    author: "Hernandes Dias Lopes",
    description: "A superioridade de Cristo",
    category: "Comentário Bíblico",
    pdfUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/hebreus.pdf",
    coverUrl: "http://localhost:5000/uploads/Comentarios/HernandesDiasLopes/hebreus.jpg"
  },
];

const addBooks = async () => {
  try {
    // Verificar se o título já existe no banco de dados
    const existingBooks = await Book.find({ title: { $in: books.map(book => book.title) } }).select('title');

    // Filtrar apenas os livros que ainda não estão no banco
    const newBooks = books.filter(book => !existingBooks.some(existingBook => existingBook.title === book.title));

    if (newBooks.length > 0) {
      await Book.insertMany(newBooks);
      console.log(`${newBooks.length} livros adicionados com sucesso!`);
    } else {
      console.log("Nenhum novo livro para adicionar.");
    }
  } catch (err) {
    console.error("Erro ao adicionar livros:", err);
  } finally {
    mongoose.connection.close();
  }
};

addBooks();
