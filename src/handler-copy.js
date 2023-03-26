const { nanoid } = require('nanoid')
const books = require('./books')

function formatJson(h, status, message, code) {
	return h.response({
		status,
		message
	}).code(code)
}

function formatReturnSuccess(h, data) {
	return h.response({
		status: 'success',
		data: {
			books: data
		}
	})
}

const addBooksHandler = (request, h) => {
	const { name, pageCount, readPage } = request.payload

	const id = nanoid(16)
	const finished = pageCount === readPage
	const reading = false
	const insertedAt = new Date().toISOString()
	const updatedAt = insertedAt

	if (!name) {
		return formatJson(h, 'fail', 'Gagal menambahkan buku. Mohon isi nama buku', 400)
	}

	if (readPage > pageCount) {
		return formatJson(h, 'fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400)
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

	if (isSuccess) {
		return h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id
			}
		}).code(201)
	}

	return formatJson(h, 'fail', 'Gagal menambahkan buku', 500)
}

const getAllBooksHandler = (request, h) => {
	let booksLength = books.length
	let { finished } = request.query
	let booksParsing
	const bookArray = []

	if (finished) {
		finished = finished === '1'

		if (finished === true) {
			const booksFilter = books.find(book => book.finished === finished)
			if (typeof booksFilter === 'object') {
				const oneBook = {
					id: booksFilter.id,
					name: booksFilter.id,
					publisher: booksFilter.publisher
				}
				booksParsing = [oneBook]

				return formatReturnSuccess(h, booksParsing)
			}
		} else {
			const booksFilter = books.filter(book => book.finished === finished)
			booksLength = booksFilter.length

			if (booksLength > 2) {
				for (let i = booksLength - 1; i > booksLength - 4; i - 1) {
					bookArray.push(books[i])
				}
			} else {
				for (let i = booksLength - 1; i > 0; i - 1) {
					bookArray.push(books[i])
				}
			}

			booksParsing = bookArray.map(book => ({
				id: book.id,
				name: book.id,
				publisher: book.publisher
			}))

			return formatReturnSuccess(h, booksParsing)
		}
	}

	if (booksLength > 1) {
		for (let i = booksLength - 1; i > booksLength - 3; i - 1) {
			bookArray.push(books[i])
		}

		booksParsing = bookArray.map(book => ({
			id: book.id,
			name: book.id,
			publisher: book.publisher
		}))

		return formatReturnSuccess(h, booksParsing)
	}

	if (booksLength > 0) {
		booksParsing = books.map(book => ({
			id: book.id,
			name: book.id,
			publisher: book.publisher
		}))
		return formatReturnSuccess(h, booksParsing)
	}

	return formatReturnSuccess(h, books)
}

const getBookByIdHandler = (request, h) => {
	const { bookId } = request.params

	const book = books.filter(object => object.id === bookId)[0]

	if (book !== undefined) {
		return {
			status: 'success',
			data: {
				book
			}
		}
	}

	return formatJson(h, 'fail', 'Buku tidak ditemukan', 404)
}

const editBookByIdHandler = (request, h) => {
	const { bookId } = request.params
	const { name, pageCount, readPage } = request.payload

	const index = books.findIndex(book => book.id === bookId)

	if (!name) {
		return formatJson(h, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', 400)
	}

	if (readPage > pageCount) {
		return formatJson(h, 'fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400)
	}

	if (index !== -1) {
		const finished = readPage === pageCount
		const reading = false
		const updatedAt = new Date().toISOString()

		books[index] = {
			...books[index],
			...request.payload,
			finished,
			reading,
			updatedAt
		}

		return formatJson(h, 'success', 'Buku berhasil diperbarui', 200)
	}

	return formatJson(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', 404)
}

const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params

	const index = books.findIndex(book => book.id === bookId)

	if (index !== -1) {
		books.splice(index, 1)

		return formatJson(h, 'success', 'Buku berhasil dihapus', 200)
	}

	return formatJson(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', 404)
}

module.exports = {
	addBooksHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler
}