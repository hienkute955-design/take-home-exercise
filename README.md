# Library Checkout — Apollo GraphQL Server

A small Apollo GraphQL server (TypeScript) that acts as the backend for a
library's book checkout system. Books can be listed, looked up, checked out to a
person, and returned.

## Tech stack

- [Apollo Server 4](https://www.apollographql.com/docs/apollo-server/) (standalone)
- TypeScript (ES modules)
- In-memory datastore (seeded on startup, wiped when the server stops)

## Getting started

```bash
npm install      # install dependencies
npm run build    # compile TypeScript to dist/
npm start        # run the server
```

The server starts at **http://localhost:4000/**. Open that URL in a browser to
explore the schema and run queries in Apollo Sandbox.

During development you can use `npm run dev` to rebuild and restart on changes.

## Schema

```graphql
type Book {
  id: ID!
  title: String!
  author: String!
  isCheckedOut: Boolean!
  checkedOutBy: Person
}

type Person {
  id: ID!
  firstName: String!
  lastName: String!
  emailAddress: String!
  phoneNumber: String
}

type Query {
  getAllBooks: [Book!]!
  getBookForId(bookId: ID!): Book!
}

type Mutation {
  checkOutBook(bookId: ID!, personId: ID!): Book!
  returnBook(bookId: ID!): Book!
}
```

## Demo queries

### 1. List all books without pulling any Person data

```graphql
query {
  getAllBooks {
    id
    title
    author
    isCheckedOut
  }
}
```

Because `checkedOutBy` is a separate field with its own resolver, the Person
lookup only happens when a client explicitly selects `checkedOutBy`. This query
never touches Person data.

### 2. Get a single checked-out book, including who has it and their contact info

```graphql
query {
  getBookForId(bookId: "book-2") {
    id
    title
    isCheckedOut
    checkedOutBy {
      firstName
      lastName
      emailAddress
      phoneNumber
    }
  }
}
```

### 3. Check out and return a book

```graphql
mutation {
  checkOutBook(bookId: "book-1", personId: "person-3") {
    id
    title
    isCheckedOut
    checkedOutBy {
      firstName
      lastName
    }
  }
}
```

```graphql
mutation {
  returnBook(bookId: "book-1") {
    id
    title
    isCheckedOut
    checkedOutBy {
      firstName
    }
  }
}
```

## How it works

- **`src/schema.ts`** — the GraphQL schema (SDL).
- **`src/datastore.ts`** — the in-memory datastore and seed data. A book's
  checkout state is stored as a single field, `checkedOutById`; when it is
  `null` the book is available.
- **`src/resolvers.ts`** — resolvers for the queries, mutations, and the two
  derived `Book` fields:
  - `isCheckedOut` is computed from `checkedOutById`, so the flag and the holder
    can never disagree.
  - `checkedOutBy` resolves the Person lazily — only when the client asks for it.
- **`src/index.ts`** — starts the standalone Apollo server.

## Seed data

Books `book-1` … `book-5` and people `person-1` … `person-3` are seeded on
startup. `book-2` and `book-5` begin already checked out.
