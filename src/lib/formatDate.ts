export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  if (day && month && year) {
    const dayWithSuffix = getDayWithSuffix(day);
    return `${dayWithSuffix} ${month}, ${year}`;
  } else if (month && year) {
    return `${month} ${year}`;
  } else if (year) {
    return `${year}`;
  } else {
    return "No date available";
  }
};

const getDayWithSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }
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
