import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Interface for book data structure
interface Book {
  id: string;
  title: string;
  authors: string;
  imageUrl: string;
}

// Interface for wishlist context methods and state
interface WishlistContextType {
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

// Create context with undefined initial value
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Provider component that manages wishlist state and persistence
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  // State for wishlist items
  const [wishlist, setWishlist] = useState<Book[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("bookWishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error);
      }
    }
  }, []);

  // Save wishlist to localStorage on changes
  useEffect(() => {
    localStorage.setItem("bookWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add a book to wishlist if not already present
  const addToWishlist = (book: Book) => {
    if (!wishlist.some((item) => item.id === book.id)) {
      setWishlist((prev) => [...prev, book]);
    }
  };

  // Remove a book from wishlist by ID
  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((book) => book.id !== id));
  };

  // Check if a book is in the wishlist
  const isInWishlist = (id: string) => {
    return wishlist.some((book) => book.id === id);
  };

  // Provide context value to children
  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
