import React from "react";
import { render, fireEvent, waitFor, screen } from "../test-utils";
import BookSearch from "./book-search";

describe("Loading State", () => {
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

  test("shows loading state while fetching", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

    const { getByPlaceholderText, getByTestId } = render(<BookSearch />);
    const searchInput = getByPlaceholderText("Search for books...");
    const form = getByTestId("book-search").querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.change(searchInput, { target: { value: "Test" } });
    fireEvent.submit(form!);

    await waitFor(
      () => {
        expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
