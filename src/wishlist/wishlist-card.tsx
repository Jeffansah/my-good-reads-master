import React from "react";
import { useWishlist } from "../context/wishlist-context";
import placeholder from "../assets/placeholder.png";
import { Trash2 } from "lucide-react";

// Props interface for the WishlistCard component
interface WishlistCardProps {
  title: string;
  image: string;
  authors: string;
  id: string;
}

const WishlistCard = ({ title, image, authors, id }: WishlistCardProps) => {
  // Get remove function from wishlist context
  const { removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-card">
      {/* Book cover image with fallback */}
      <img
        src={image ?? placeholder}
        alt={title}
        className="wishlist-card-image"
      />
      {/* Book details and remove button */}
      <div className="wishlist-card-info">
        <h3 className="wishlist-card-title">{title}</h3>
        <p className="wishlist-card-authors">{authors}</p>
        {/* Remove from wishlist button */}
        <button
          onClick={() => removeFromWishlist(id)}
          className="wishlist-card-remove"
          aria-label="Remove from wishlist"
          data-testid="wishlist-card-remove"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
