import React from "react";
import { Book } from "../types/books.types";
import BookCard from "./book-card";
import Loading from "./loading";
import notfound from "../assets/not-found.png";
import search from "../assets/search.png";
import serverErrorImage from "../assets/server.png";

// Props interface for the Books component
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
  // Show loading skeleton while fetching books
  if (isLoading) {
    return <Loading count={6} />;
  }

  // Show "no results" state when search returns null

  if (!books) {
    return (
      <div className="not-found-container">
        <img src={notfound} className="not-found-image" alt="No books found" />
        <p className="not-found-text">No books found for "{searchQuery}"</p>
      </div>
    );
  }

  // Show empty state when no search has been performed
  if (books.length === 0) {
    return (
      <div className="not-found-container">
        <img src={search} className="not-found-image" alt="Search for books" />
        <p className="not-found-text">Search for books to see results</p>
      </div>
    );
  }

  // Render the list of books with search query header
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
