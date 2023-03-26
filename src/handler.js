const { nanoid } = require('nanoid')
const books = require('./books')

const addBooksHandler = (request, h) => {
  const { name, pageCount, readPage } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage ? true : false
  const reading = false
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const newBook = {
    id,
    ...request.payload,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter(book => book.id === id).length

  if (isSuccess){
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
          bookId: id
      }
    }).code(201)
  }

  return h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku'
  }).code(500)
}

const getAllBooksHandler = (request, h) => {
  let length = books.length
  const bookArray = []
  const { finished } = request.query

  if (finished) {
    filter = finished === '0' ? false : true

    if (finished == true) {
      const booksFilter = books.find(book => book.finished == finished)
      if (typeof booksFilter == 'object'){
        let oneBook = {
          id: booksFilter.id,
          name: booksFilter.id,
          publisher: booksFilter.publisher
        }
        booksParsing = [oneBook]
        
        return h.response({
          status: 'success',
          data: {
            books: booksParsing
          }
        })
      }
    } else {
      const booksFilter = books.filter(book => book.finished == finished)
      length = booksFilter.length

      if (length > 2){
        for (let i = length - 1; i > length - 4; i--){
          bookArray.push(books[i])
        }
      } else {
        for (let i = length - 1; i > 0; i--){
          bookArray.push(books[i])
        }
      }

      booksParsing = bookArray.map(book => ({
          id: book.id,
          name: book.id,
          publisher: book.publisher
        })
      )

      return h.response({
        status: 'success',
        data: {
          books: booksParsing
        }
      })
    }
  }
  
  if (length > 1) {
    for (let i = length - 1; i > length - 3; i--){
      bookArray.push(books[i])
    }

    booksParsing = bookArray.map(book => ({
        id: book.id,
        name: book.id,
        publisher: book.publisher
      })
    )

    return {
      status: 'success',
      data: {
        books: booksParsing
      }
    }
  }

  if (length > 0) {
    booksParsing = books.map(book => ({
        id: book.id,
        name: book.id,
        publisher: book.publisher
      })
    )
    return {
      status: 'success',
      data: {
        books: booksParsing
      }
    }
  }

  return h.response({
    status: 'success',
    data: {
      books
    }
  })
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  
  const book = books.filter(book => book.id === bookId)[0]

  if (book !== undefined){
    return {
      status: 'success',
      data: {
        book
      }
    }
  }
  
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, pageCount, readPage } = request.payload

  const index = books.findIndex(book => book.id === bookId)

  if (!name){
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount){
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  if (index !== -1){
    const finished = readPage === pageCount ? true : false
    const reading = false
    const updatedAt = new Date().toISOString()

    books[index] = {
      ...books[index],
      ...request.payload,
      finished,
      reading,
      updatedAt
    }

    return {
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404)
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex(book => book.id === bookId)

  if (index !== -1){
    books.splice(index, 1)

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
}

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}