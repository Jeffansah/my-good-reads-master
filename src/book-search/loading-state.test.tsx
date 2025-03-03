import React from "react";
import { render, fireEvent, waitFor, screen } from "../test-utils";
import BookSearch from "./book-search";

// Test suite for loading state functionality
describe("Loading State", () => {
  // Store original fetch implementation for cleanup
  const originalFetch = global.fetch;

  // Setup before each test
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn();
  });

  // Cleanup after each test
  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
  });

  // Test loading state during API fetch
  test("shows loading state while fetching", async () => {
    // Mock fetch with artificial delay
    global.fetch = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

    // Render component and get test elements
    const { getByPlaceholderText, getByTestId } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    // Simulate search input and form submission
    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    // Verify loading skeleton appears during fetch
    await waitFor(
      () => {
        expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
