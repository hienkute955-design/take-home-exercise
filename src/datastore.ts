export interface BookRecord {
  id: string;
  title: string;
  author: string;
  checkedOutById: string | null;
}

export interface PersonRecord {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
}

const books: BookRecord[] = [
  { id: "book-1", title: "The Pragmatic Programmer", author: "Andrew Hunt", checkedOutById: null },
  { id: "book-2", title: "Clean Code", author: "Robert C. Martin", checkedOutById: "person-1" },
  { id: "book-3", title: "The Mythical Man-Month", author: "Fred Brooks", checkedOutById: null },
  { id: "book-4", title: "Refactoring", author: "Martin Fowler", checkedOutById: null },
  { id: "book-5", title: "Design Patterns", author: "Erich Gamma", checkedOutById: "person-2" },
];

const people: PersonRecord[] = [
  {
    id: "person-1",
    firstName: "Ada",
    lastName: "Lovelace",
    emailAddress: "ada@example.com",
    phoneNumber: "555-0101",
  },
  {
    id: "person-2",
    firstName: "Alan",
    lastName: "Turing",
    emailAddress: "alan@example.com",
    phoneNumber: null,
  },
  {
    id: "person-3",
    firstName: "Grace",
    lastName: "Hopper",
    emailAddress: "grace@example.com",
    phoneNumber: "555-0103",
  },
];

export const datastore = {
  getAllBooks(): BookRecord[] {
    return books;
  },

  getBookById(id: string): BookRecord | null {
    return books.find((book) => book.id === id) ?? null;
  },

  getPersonById(id: string): PersonRecord | null {
    return people.find((person) => person.id === id) ?? null;
  },

  setCheckedOutBy(bookId: string, personId: string | null): BookRecord | null {
    const book = this.getBookById(bookId);
    if (!book) return null;
    book.checkedOutById = personId;
    return book;
  },
};
