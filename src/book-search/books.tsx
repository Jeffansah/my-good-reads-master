import React from "react";
import { Book } from "../types/books.types";
import BookCard from "./book-card";
interface BookListProps {
  books: Book[];
  isLoading: boolean;
  searchQuery: string;
}

const Books = ({ books, isLoading, searchQuery }: BookListProps) => {
  if (isLoading) {
    return <>loading...</>;
  }

  if (books.length === 0 && searchQuery) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">
          No books found for "{searchQuery}"
        </p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Search for books to see results</p>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="books-header">Books related to "{searchQuery}"</h1>
      <div className="books-list-container">
        {books.map(
          (book) => book.volumeInfo && <BookCard key={book.id} book={book} />
        )}
      </div>
    </div>
  );
};

export default Books;
