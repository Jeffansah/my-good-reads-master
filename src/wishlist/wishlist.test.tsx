import React from "react";
import { render, fireEvent, waitFor, screen } from "../test-utils";
import BookSearch from "../book-search/book-search";

describe("Wishlist", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
  });

  test("renders wishlist with stored items and images", async () => {
    const mockWishlistData = [
      {
        id: "1",
        title: "Stored Book",
        authors: "Stored Author",
        imageUrl: "https://example.com/book-cover.jpg",
      },
    ];
    localStorage.setItem("bookWishlist", JSON.stringify(mockWishlistData));

    const { findByText, getByAltText } = render(<BookSearch />);

    await findByText("1 book");
    expect(await findByText("Stored Book")).toBeInTheDocument();

    const bookImage = getByAltText("Stored Book") as HTMLImageElement;
    expect(bookImage).toBeInTheDocument();
    expect(bookImage.src).toBe("https://example.com/book-cover.jpg");
  });

  test("handles corrupted localStorage data", async () => {
    localStorage.setItem("bookWishlist", "invalid json");
    const { findByText } = render(<BookSearch />);
    await findByText("Your wishlist is empty");
    expect(await findByText("0 books")).toBeInTheDocument();
  });

  test("adds a book to wishlist", async () => {
    // Mock successful API response
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalItems: 1,
            items: [
              {
                id: "123",
                volumeInfo: {
                  title: "Test Book",
                  authors: ["Test Author"],
                  imageLinks: {
                    thumbnail: "https://example.com/book-cover.jpg",
                  },
                },
              },
            ],
          }),
      })
    );

    const { getByPlaceholderText, getByTestId, findByText } = render(
      <BookSearch />
    );

    // Perform search
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    // Wait for results and click add to wishlist
    await findByText("Test Book");
    const addToWishlistButton = screen.getByRole("button", {
      name: /add to wishlist/i,
    });
    fireEvent.click(addToWishlistButton);

    // Verify book was added to wishlist
    await findByText("1 book");
    expect(
      await findByText("Test Book", { selector: ".wishlist-card-title" })
    ).toBeInTheDocument();

    // Verify localStorage was updated
    const wishlistData = JSON.parse(
      localStorage.getItem("bookWishlist") || "[]"
    );
    expect(wishlistData).toHaveLength(1);
    expect(wishlistData[0]).toMatchObject({
      id: "123",
      title: "Test Book",
      authors: "Test Author",
      imageUrl: "https://example.com/book-cover.jpg",
    });
  });

  test("deletes a book from wishlist", async () => {
    // Setup initial wishlist
    const mockWishlistData = [
      {
        id: "1",
        title: "Stored Book",
        authors: "Stored Author",
        imageUrl: "https://example.com/book-cover.jpg",
      },
    ];
    localStorage.setItem("bookWishlist", JSON.stringify(mockWishlistData));

    const { findByText } = render(<BookSearch />);

    // Wait for wishlist to load
    await findByText("1 book");
    expect(await findByText("Stored Book")).toBeInTheDocument();

    // Click delete button
    const deleteButton = screen.getByTestId("wishlist-card-remove");
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    // Verify book was removed from wishlist
    await findByText("Your wishlist is empty");
    expect(await findByText("0 books")).toBeInTheDocument();

    // Verify localStorage was updated
    const wishlistData = JSON.parse(
      localStorage.getItem("bookWishlist") || "[]"
    );
    expect(wishlistData).toHaveLength(0);
  });
});
