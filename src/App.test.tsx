import React from "react";

import App from "./App";
import { render } from "./test-utils";

describe("App Component", () => {
  // Checking if the main app renders without crashing
  test("renders without crashing", () => {
    render(<App />);
  });

  // Check header title
  test("renders header with title", () => {
    const { getByText } = render(<App />);
    const title = getByText("My Good Reads");
    expect(title).toBeInTheDocument();
  });

  // Check BookSearch component
  test("renders BookSearch component", () => {
    const { getByTestId } = render(<App />);
    const bookSearch = getByTestId("book-search");
    expect(bookSearch).toBeInTheDocument();
  });

  // Check mobile wishlist
  test("renders WishlistMobile component", () => {
    const { getByTestId } = render(<App />);
    const wishlistMobile = getByTestId("wishlist-mobile-container");
    expect(wishlistMobile).toBeInTheDocument();
  });
});
