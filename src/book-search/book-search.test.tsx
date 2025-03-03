import React from "react";
import { render, fireEvent, waitFor, screen } from "../test-utils";
import BookSearch from "./book-search";

describe("BookSearch Component", () => {
  // Setup fetch mock
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    // Restore original fetch after each test
    global.fetch = originalFetch;
  });

  // ================ Initial UI State Tests ================
  test("renders initial state correctly", () => {
    const {
      getByTestId,
      getByPlaceholderText,
      getByRole,
      getByText,
      queryByTestId,
    } = render(<BookSearch />);

    // Check main elements
    expect(getByTestId("book-search")).toBeInTheDocument();
    expect(getByPlaceholderText("Search for books...")).toHaveAttribute(
      "type",
      "text"
    );
    expect(getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(getByText("Search for books to see results")).toBeInTheDocument();

    // Check wishlist empty state
    expect(getByText("My Wishlist")).toBeInTheDocument();
    expect(getByText("0 books")).toBeInTheDocument();
    expect(getByText("Your wishlist is empty")).toBeInTheDocument();

    // Verify pagination is not present initially
    expect(queryByTestId("pagination")).not.toBeInTheDocument();
  });

  // ================ Search Functionality Tests ================
  test("handles search input interaction", () => {
    const { getByPlaceholderText } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");
    fireEvent.change(searchInput, { target: { value: "Testing 123" } });
    expect(searchInput).toHaveValue("Testing 123");
  });

  test("performs search and displays results", async () => {
    // Mock successful API response with realistic data structure
    const mockBooks = {
      kind: "books#volumes",
      totalItems: 1,
      items: [
        {
          kind: "books#volume",
          id: "123",
          etag: "test123",
          selfLink: "https://www.googleapis.com/books/v1/volumes/123",
          volumeInfo: {
            title: "React Testing",
            subtitle: "A Comprehensive Guide",
            authors: ["Test Author"],
            publisher: "Test Publisher",
            publishedDate: "2023",
            description: "A book about testing React applications",
            industryIdentifiers: [
              {
                type: "ISBN_13",
                identifier: "9781234567890",
              },
            ],
            pageCount: 200,
            categories: ["Computers", "Programming"],
            imageLinks: {
              smallThumbnail: "test-image-small.jpg",
              thumbnail: "test-image.jpg",
            },
            language: "en",
            previewLink: "https://books.google.com/books?id=123",
            infoLink: "https://books.google.com/books?id=123",
          },
          saleInfo: {
            country: "US",
            saleability: "FOR_SALE",
            isEbook: true,
          },
          accessInfo: {
            country: "US",
            viewability: "PARTIAL",
            embeddable: true,
            publicDomain: false,
          },
        },
      ],
    };

    jest.clearAllMocks();
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBooks),
      })
    );

    const { getByPlaceholderText, getByTestId, findByText } = render(
      <BookSearch />
    );

    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.change(searchInput, { target: { value: "React" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0]).toBe(
        "https://www.googleapis.com/books/v1/volumes?q=React&startIndex=0&maxResults=10"
      );
    });

    const bookTitle = await findByText("React Testing");
    expect(bookTitle).toBeInTheDocument();
    expect(await findByText("Test Author")).toBeInTheDocument();
    expect(
      await findByText(/A book about testing React applications/)
    ).toBeInTheDocument();
  });

  test("debounces search requests", async () => {
    jest.useFakeTimers();
    const { getByPlaceholderText } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");

    fireEvent.change(searchInput, { target: { value: "React" } });
    fireEvent.change(searchInput, { target: { value: "React Testing" } });
    fireEvent.change(searchInput, {
      target: { value: "React Testing Library" },
    });

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("React%20Testing%20Library");
    });

    jest.useRealTimers();
  });

  // ================ Error Handling Tests ================
  test("handles API errors", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    const { getByPlaceholderText, getByTestId, findByText } = render(
      <BookSearch />
    );

    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.change(searchInput, { target: { value: "React" } });
    fireEvent.submit(form!);

    await findByText(/No books found for "React"/);
  });

  test("handles empty search query", async () => {
    const { getByPlaceholderText, getByTestId } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.change(searchInput, { target: { value: "   " } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ================ Edge Case Tests ================
  test("handles API response with missing items array", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalItems: 0,
            // Missing items array
          }),
      })
    );

    const { getByPlaceholderText, getByTestId, findByText } = render(
      <BookSearch />
    );
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    await findByText(/No books found for "Test"/);
  });

  test("shows initial search prompt when books array is empty", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalItems: 0,
            items: [],
          }),
      })
    );

    const { getByPlaceholderText, getByTestId, findByText } = render(
      <BookSearch />
    );
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    await findByText(/Search for books to see results/);
    expect(screen.getByAltText("Search for books")).toBeInTheDocument();
  });
});
