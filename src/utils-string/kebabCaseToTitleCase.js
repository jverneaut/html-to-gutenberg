// Converts a kebab-case string to Title Case
// e.g., "hello-world" -> "Hello World"
export default (str) =>
  str
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize the first letter of each word
