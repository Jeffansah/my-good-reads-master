import { formatDate } from "./formatDate";

// Test suite for date formatting functionality
describe("formatDate", () => {
  // Test full date formatting with different day suffixes
  test("formats date with day, month, and year", () => {
    expect(formatDate("2024-03-15")).toBe("15th March, 2024");
    expect(formatDate("2024-03-01")).toBe("1st March, 2024");
    expect(formatDate("2024-03-02")).toBe("2nd March, 2024");
    expect(formatDate("2024-03-03")).toBe("3rd March, 2024");
    expect(formatDate("2024-03-11")).toBe("11th March, 2024");
    expect(formatDate("2024-03-12")).toBe("12th March, 2024");
    expect(formatDate("2024-03-13")).toBe("13th March, 2024");
  });

  // Test partial date formatting (month and year only)
  test("handles dates with only month and year", () => {
    expect(formatDate("2024-03")).toBe("March 2024");
  });

  // Test year-only formatting
  test("handles dates with only year", () => {
    expect(formatDate("2024")).toBe("2024");
  });

  // Test error handling for invalid inputs
  test("handles invalid dates", () => {
    expect(formatDate("invalid-date")).toBe("Invalid Date");
    expect(formatDate("")).toBe("No date available");
    expect(formatDate("2024-13-45")).toBe("Invalid Date");
  });

  // Test handling of different date format inputs
  test("handles different date formats", () => {
    expect(formatDate("2024/03/15")).toBe("15th March, 2024");
    expect(formatDate("15-03-2024")).toBe("15th March, 2024");
    expect(formatDate("2024-03-15T12:00:00Z")).toBe("15th March, 2024");
  });

  // Test special date cases
  test("handles edge cases", () => {
    expect(formatDate("2024-12-31")).toBe("31st December, 2024");
    expect(formatDate("2024-01-01")).toBe("1st January, 2024");
    expect(formatDate("2024-02-29")).toBe("29th February, 2024");
  });
});
