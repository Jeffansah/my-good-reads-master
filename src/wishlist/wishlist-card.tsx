import React from "react";
import { useWishlist } from "../context/wishlist-context";
import placeholder from "../assets/placeholder.png";
import { Trash2 } from "lucide-react";

interface WishlistCardProps {
  title: string;
  image: string;
  authors: string;
  id: string;
}

const WishlistCard = ({ title, image, authors, id }: WishlistCardProps) => {
  const { removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-card">
      <img
        src={image ?? placeholder}
        alt={title}
        className="wishlist-card-image"
      />
      <div className="wishlist-card-info">
        <h3 className="wishlist-card-title">{title}</h3>
        <p className="wishlist-card-authors">{authors}</p>
        <button
          onClick={() => removeFromWishlist(id)}
          className="wishlist-card-remove"
          aria-label="Remove from wishlist"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
