import { GraphQLError } from "graphql";

export const ErrorCode = {
  BOOK_NOT_FOUND: "BOOK_NOT_FOUND",
  PERSON_NOT_FOUND: "PERSON_NOT_FOUND",
  BOOK_ALREADY_CHECKED_OUT: "BOOK_ALREADY_CHECKED_OUT",
  BOOK_NOT_CHECKED_OUT: "BOOK_NOT_CHECKED_OUT",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

function domainError(message: string, code: ErrorCode): GraphQLError {
  return new GraphQLError(message, { extensions: { code } });
}

export function bookNotFoundError(bookId: string): GraphQLError {
  return domainError(`No book found with id "${bookId}"`, ErrorCode.BOOK_NOT_FOUND);
}

export function personNotFoundError(personId: string): GraphQLError {
  return domainError(`No person found with id "${personId}"`, ErrorCode.PERSON_NOT_FOUND);
}

export function bookAlreadyCheckedOutError(bookTitle: string): GraphQLError {
  return domainError(
    `Book "${bookTitle}" is already checked out`,
    ErrorCode.BOOK_ALREADY_CHECKED_OUT,
  );
}

export function bookNotCheckedOutError(bookTitle: string): GraphQLError {
  return domainError(`Book "${bookTitle}" is not checked out`, ErrorCode.BOOK_NOT_CHECKED_OUT);
}
