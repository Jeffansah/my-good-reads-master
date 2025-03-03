import React from "react";
import "./styles/App.scss";
import BookSearch from "./book-search/book-search";
import { WishlistProvider } from "./context/wishlist-context";
import WishlistMobile from "./wishlist/wishlist-mobile";

function App() {
  return (
    <WishlistProvider>
      <div className="app-section">
        <header className="header">
          <div className="header--content">
            <h1>My Good Reads</h1>
          </div>
        </header>

        <BookSearch />
        <WishlistMobile />
      </div>
    </WishlistProvider>
  );
}

export default App;
