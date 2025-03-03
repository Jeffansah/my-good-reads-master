import React from "react";
import { render, fireEvent, waitFor, screen } from "../test-utils";
import BookSearch from "./book-search";

// Test suite for pagination functionality
describe("Pagination", () => {
  const originalFetch = global.fetch;

  // Setup and cleanup for each test
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
  });

  // Test that pagination respects the maxResults limit
  test("handles pagination limits", async () => {
    // Mock API response with 20 items total, returning 10 per page
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalItems: 20,
            items: Array(10).fill({
              volumeInfo: {
                title: "Test Book",
                authors: ["Test Author"],
              },
            }),
          }),
      })
    );

    const { getByPlaceholderText, getByTestId } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    // Perform search and verify maxResults parameter
    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("maxResults=10");
    });
  });

  // Test that pagination parameters are correctly handled
  test("handles pagination parameters correctly", async () => {
    // Mock API response with 20 items total
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalItems: 20,
            items: Array(10).fill({
              volumeInfo: {
                title: "Test Book",
                authors: ["Test Author"],
              },
            }),
          }),
      })
    );

    const { getByPlaceholderText, getByTestId } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    // Test initial page load (page 1)
    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=0&maxResults=10");
    });

    jest.clearAllMocks();

    // Test page 2 navigation
    const paginationButton = screen.getByTestId("pagination-page-2");
    fireEvent.click(paginationButton);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=10&maxResults=10");
    });
  });

  // Test previous and next button functionality
  test("prev and next buttons work correctly", async () => {
    // Mock API response with 30 items (3 pages)
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalItems: 30,
            items: Array(10).fill({
              volumeInfo: {
                title: "Test Book",
                authors: ["Test Author"],
              },
            }),
          }),
      })
    );

    const { getByPlaceholderText, getByTestId } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    // Initial search to load first page
    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    // Verify initial results loaded
    await waitFor(() => {
      const books = screen.getAllByText("Test Book");
      expect(books).toHaveLength(10);
    });

    // Verify prev button is disabled on first page
    const prevButton = screen.getByTestId("pagination-prev");
    expect(prevButton).toHaveClass("disabled");

    // Verify next button is enabled
    const nextButton = screen.getByTestId("pagination-next");
    expect(nextButton).not.toHaveClass("disabled");

    // Test navigation to next page
    jest.clearAllMocks();
    fireEvent.click(nextButton);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=10&maxResults=10");
    });

    // Verify prev button becomes enabled
    expect(prevButton).not.toHaveClass("disabled");

    // Test navigation back to first page
    jest.clearAllMocks();
    fireEvent.click(prevButton);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=0&maxResults=10");
    });

    // Verify prev button is disabled again
    expect(prevButton).toHaveClass("disabled");
  });
});
