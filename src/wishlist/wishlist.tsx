import React from "react";
import { useWishlist } from "../context/wishlist-context";
import WishlistCard from "./wishlist-card";

const Wishlist = () => {
  // Get wishlist data from context
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-container">
      {/* Wishlist header with title and count */}
      <div className="wishlist-header">
        <h2 className="wishlist-title">My Wishlist</h2>
        <span className="wishlist-count">
          {wishlist.length} {wishlist.length === 1 ? "book" : "books"}
        </span>
      </div>

      {/* Conditional rendering based on wishlist state */}
      {wishlist.length === 0 ? (
        // Empty state message
        <div className="wishlist-empty">
          <p className="wishlist-empty-text">Your wishlist is empty</p>
          <p className="wishlist-empty-subtext">
            Search and add books you like
          </p>
        </div>
      ) : (
        // List of wishlist items
        <div className="wishlist-items">
          {wishlist.map((book) => (
            <WishlistCard
              key={book.id}
              title={book.title}
              image={book.imageUrl}
              authors={book.authors}
              id={book.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
