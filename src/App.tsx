import React from "react";
import "./styles/App.scss";
import BookSearch from "./book-search/book-search";
import { WishlistProvider } from "./context/wishlist-context";
import WishlistMobile from "./wishlist/wishlist-mobile";

// Main application component
function App() {
  return (
    // Wrapper with wishlist context provider
    <WishlistProvider>
      <div className="app-section">
        {/* Application header */}
        <header className="header">
          <div className="header--content">
            <h1>My Good Reads</h1>
          </div>
        </header>

        {/* Main content area */}
        <BookSearch />
        {/* Mobile wishlist panel */}
        <WishlistMobile />
      </div>
    </WishlistProvider>
  );
}

export default App;
