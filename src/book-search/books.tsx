import React from "react";
import { Book } from "../types/books.types";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {books.map((book) => (
        <p>{book.volumeInfo.title}</p>
      ))}
    </div>
  );
};

export default Books;
