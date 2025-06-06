// Converts a string to sentence case (supports camelCase and kebab_case)
// e.g., "thisIsATest" -> "This is a test"
// e.g., "this_is_a_test" -> "This is a test"
export default (str) =>
  str
    .replace(/_/g, " ") // Replace _ character with space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
    .toLowerCase() // Convert the whole string to lowercase
    .replace(/^./, (c) => c.toUpperCase()); // Capitalize the first character
