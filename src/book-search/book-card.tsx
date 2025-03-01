import React, { useState } from "react";
import { Book } from "../types/books.types";
import placeholder from "../assets/placeholder.png";
import { formatDate } from "../lib/formatDate";
import { Heart, Plus } from "lucide-react";

const BookCard = ({ book }: { book: Book }) => {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const { volumeInfo } = book;

  const bookInfo = {
    id: book.id,
    title: volumeInfo.title,
    authors: volumeInfo.authors
      ? volumeInfo.authors.join(", ")
      : "Unknown Author",
    publisher: volumeInfo.publisher ?? "Unknown Publisher",
    publishedDate: volumeInfo.publishedDate
      ? formatDate(volumeInfo.publishedDate)
      : "Unknown Date",
    description: volumeInfo.description ?? "No description available",
    imageUrl: volumeInfo.imageLinks?.thumbnail ?? placeholder,
  };

  return (
    <div className="book-card">
      <div className="book-card-image-container">
        <img
          src={bookInfo.imageUrl}
          alt="book cover image"
          className="book-card-image"
        />
      </div>

      <div className="book-content">
        <div className="book-content-info">
          <h3 className="content-title">{bookInfo.title}</h3>
          <p className="content-description">{bookInfo.description}</p>
          <div className="content-meta">
            <p className="content-authors">{bookInfo.authors}</p>
            <p className="content-publisher">{bookInfo.publisher}</p>
            <p className="content-publisher-date">{bookInfo.publishedDate}</p>
          </div>
        </div>
        <button
          className={`wishlist-button ${isWishlisted ? "wishlisted" : ""}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className="heart-icon" />
          <span>{isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}</span>
        </button>
      </div>
    </div>
  );
};

export default BookCard;
