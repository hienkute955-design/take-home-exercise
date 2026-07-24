import { datastore, type BookRecord, type PersonRecord } from "./datastore.js";
import {
  bookAlreadyCheckedOutError,
  bookNotCheckedOutError,
  bookNotFoundError,
  personNotFoundError,
} from "./errors.js";

function getBookOrThrow(bookId: string): BookRecord {
  const book = datastore.getBookById(bookId);
  if (!book) throw bookNotFoundError(bookId);
  return book;
}

function getPersonOrThrow(personId: string): PersonRecord {
  const person = datastore.getPersonById(personId);
  if (!person) throw personNotFoundError(personId);
  return person;
}

export const resolvers = {
  Query: {
    getAllBooks: (): BookRecord[] => datastore.getAllBooks(),

    getBookForId: (_parent: unknown, args: { bookId: string }): BookRecord =>
      getBookOrThrow(args.bookId),
  },

  Mutation: {
    checkOutBook: (
      _parent: unknown,
      args: { bookId: string; personId: string },
    ): BookRecord => {
      const book = getBookOrThrow(args.bookId);
      const person = getPersonOrThrow(args.personId);

      if (book.checkedOutById) {
        throw bookAlreadyCheckedOutError(book.title);
      }

      return datastore.setCheckedOutBy(book.id, person.id) as BookRecord;
    },

    returnBook: (_parent: unknown, args: { bookId: string }): BookRecord => {
      const book = getBookOrThrow(args.bookId);

      if (!book.checkedOutById) {
        throw bookNotCheckedOutError(book.title);
      }

      return datastore.setCheckedOutBy(book.id, null) as BookRecord;
    },
  },

  Book: {
    isCheckedOut: (book: BookRecord): boolean => book.checkedOutById !== null,

    checkedOutBy: (book: BookRecord): PersonRecord | null =>
      book.checkedOutById ? datastore.getPersonById(book.checkedOutById) : null,
  },
};
