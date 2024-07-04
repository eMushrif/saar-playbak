export function formatDateNicely(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    // weekday: "long",
    // year: "numeric",
    // month: "long",
    // day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    // timeZoneName: "short",
  };

  return date.toLocaleString("en-US", options);
}

// Example usage:
// const currentDate = new Date();
// console.log(formatDateNicely(currentDate));
// Output example: "Tuesday, June 13, 2023 at 03:45:30 PM EDT"
