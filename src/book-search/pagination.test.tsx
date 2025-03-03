import React from "react";
import { render, fireEvent, waitFor, screen } from "../test-utils";
import BookSearch from "./book-search";

describe("Pagination", () => {
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

  test("handles pagination limits", async () => {
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

    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("maxResults=10");
    });
  });

  test("handles pagination parameters correctly", async () => {
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

    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=0&maxResults=10");
    });

    jest.clearAllMocks();

    const paginationButton = screen.getByTestId("pagination-page-2");
    fireEvent.click(paginationButton);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=10&maxResults=10");
    });
  });

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

    // Perform initial search
    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    // Wait for initial results
    await waitFor(() => {
      const books = screen.getAllByText("Test Book");
      expect(books).toHaveLength(10);
    });

    // Check that prev button is disabled on first page
    const prevButton = screen.getByTestId("pagination-prev");
    expect(prevButton).toHaveClass("disabled");

    // Check that next button is enabled
    const nextButton = screen.getByTestId("pagination-next");
    expect(nextButton).not.toHaveClass("disabled");

    // Click next button
    jest.clearAllMocks();
    fireEvent.click(nextButton);

    // Verify API call with correct startIndex
    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=10&maxResults=10");
    });

    // Verify prev button is now enabled
    expect(prevButton).not.toHaveClass("disabled");

    // Click prev button
    jest.clearAllMocks();
    fireEvent.click(prevButton);

    // Verify API call with correct startIndex
    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("startIndex=0&maxResults=10");
    });

    // Verify prev button is disabled again
    expect(prevButton).toHaveClass("disabled");
  });
});
