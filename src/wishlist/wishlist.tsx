import React from "react";
import { useWishlist } from "../context/wishlist-context";
import WishlistCard from "./wishlist-card";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h2 className="wishlist-title">My Wishlist</h2>
        <span className="wishlist-count">
          {wishlist.length} {wishlist.length === 1 ? "book" : "books"}
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p className="wishlist-empty-text">Your wishlist is empty</p>
          <p className="wishlist-empty-subtext">
            Search and add books you like
          </p>
        </div>
      ) : (
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
