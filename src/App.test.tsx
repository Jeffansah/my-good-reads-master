import React from "react";

import App from "./App";
import { render } from "./test-utils";

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
  });

  test("renders header with title", () => {
    const { getByText } = render(<App />);
    const title = getByText("My Good Reads");
    expect(title).toBeInTheDocument();
  });

  test("renders BookSearch component", () => {
    const { getByTestId } = render(<App />);
    const bookSearch = getByTestId("book-search");
    expect(bookSearch).toBeInTheDocument();
  });

  test("renders WishlistMobile component", () => {
    const { getByTestId } = render(<App />);
    const wishlistMobile = getByTestId("wishlist-mobile-container");
    expect(wishlistMobile).toBeInTheDocument();
  });
});
