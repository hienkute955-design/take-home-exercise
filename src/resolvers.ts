import { GraphQLError } from "graphql";
import { datastore, type BookRecord, type PersonRecord } from "./datastore.js";

export const resolvers = {
  Query: {
    getAllBooks: (): BookRecord[] => datastore.getAllBooks(),

    getBookForId: (_parent: unknown, args: { bookId: string }): BookRecord => {
      const book = datastore.getBookById(args.bookId);
      if (!book) {
        throw new GraphQLError(`No book found with id "${args.bookId}"`, {
          extensions: { code: "BOOK_NOT_FOUND" },
        });
      }
      return book;
    },
  },

  Mutation: {
    checkOutBook: (
      _parent: unknown,
      args: { bookId: string; personId: string },
    ): BookRecord => {
      const book = datastore.getBookById(args.bookId);
      if (!book) {
        throw new GraphQLError(`No book found with id "${args.bookId}"`, {
          extensions: { code: "BOOK_NOT_FOUND" },
        });
      }

      const person = datastore.getPersonById(args.personId);
      if (!person) {
        throw new GraphQLError(`No person found with id "${args.personId}"`, {
          extensions: { code: "PERSON_NOT_FOUND" },
        });
      }

      if (book.checkedOutById) {
        throw new GraphQLError(`Book "${book.title}" is already checked out`, {
          extensions: { code: "BOOK_ALREADY_CHECKED_OUT" },
        });
      }

      return datastore.setCheckedOutBy(book.id, person.id) as BookRecord;
    },

    returnBook: (_parent: unknown, args: { bookId: string }): BookRecord => {
      const book = datastore.getBookById(args.bookId);
      if (!book) {
        throw new GraphQLError(`No book found with id "${args.bookId}"`, {
          extensions: { code: "BOOK_NOT_FOUND" },
        });
      }

      if (!book.checkedOutById) {
        throw new GraphQLError(`Book "${book.title}" is not checked out`, {
          extensions: { code: "BOOK_NOT_CHECKED_OUT" },
        });
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
