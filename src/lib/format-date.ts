export const formatDate = (dateString: string): string => {
  // Return early if no date provided
  if (!dateString) {
    return "No date available";
  }

  // Normalize date separators and split into parts
  const normalizedDate = dateString.replace(/\//g, "-");
  const parts = normalizedDate.split("-");

  // Handle year-only format (e.g., "2024")
  if (parts.length === 1 && parts[0].length === 4) {
    return parts[0];
  }

  // Handle month-year format (e.g., "2024-03")
  if (parts.length === 2 && parts[0].length === 4 && parts[1].length === 2) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    if (month < 1 || month > 12) {
      return "Invalid Date";
    }
    const date = new Date(year, month - 1);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return `${date.toLocaleString("default", { month: "long" })} ${parts[0]}`;
  }

  // Handle full date format
  let date: Date;
  if (parts.length === 3) {
    // Check if the date is in day-month-year format (e.g., "15-03-2024")
    if (parts[2].length === 4) {
      const year = parseInt(parts[2]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[0]);
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return "Invalid Date";
      }
      date = new Date(year, month - 1, day);
    } else {
      // Assume year-month-day format (e.g., "2024-03-15")
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return "Invalid Date";
      }
      date = new Date(year, month - 1, day);
    }
  } else {
    date = new Date(normalizedDate);
  }

  // Validate the parsed date
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Format the date components
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Add ordinal suffix to day and return formatted date
  const dayWithSuffix = getDayWithSuffix(day);
  return `${dayWithSuffix} ${month}, ${year}`;
};

// Helper function to add ordinal suffix to day number
const getDayWithSuffix = (day: number): string => {
  // Special case for 11th, 12th, 13th
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }
  // Add appropriate suffix based on last digit
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};
