const { nanoid } = require('nanoid');
const books = require('./bookself');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading  } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const finished = pageCount === readPage;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, createdAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = () => {
  const formattedBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return {
    status: 'success',
    data: {
      books: formattedBooks,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.find((b) => b.id === id);

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };