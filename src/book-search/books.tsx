import React from "react";
import { Book } from "../types/books.types";
import BookCard from "./book-card";
import Loading from "./loading";
import notfound from "../assets/not-found.png";
import search from "../assets/search.png";

interface BookListProps {
  books: Book[] | null;
  isLoading: boolean;
  searchQuery: string;
  totalItems: number;
}

const Books = ({
  books,
  isLoading,
  searchQuery,
  totalItems,
}: BookListProps) => {
  if (isLoading) {
    return <Loading count={6} />;
  }

  if (!books) {
    return (
      <div className="not-found-container">
        <img src={notfound} className="not-found-image" />
        <p className="not-found-text">No books found for "{searchQuery}"</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="not-found-container">
        <img src={search} className="not-found-image" />
        <p className="not-found-text">Search for books to see results</p>
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
