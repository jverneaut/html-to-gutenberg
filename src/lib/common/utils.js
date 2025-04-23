// Converts a space-separated string to an array
// e.g., "apple orange banana" -> ["apple", "orange", "banana"]
export const spaceSeparatedStringToArray = (str) => str.split(/\s+/);

// Parses a raw string value into its correct type (e.g., string, number, boolean)
// If parsing fails, returns the original string
export const parseRawValue = (rawValue) => {
  let value = null;

  try {
    value = JSON.parse(rawValue);
  } catch {
    value = rawValue;
  }

  return value;
};

// Converts a kebab-case string to Title Case
// e.g., "hello-world" -> "Hello World"
export const kebabCaseToTitleCase = (str) =>
  str
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize the first letter of each word

// Converts a camelCase string to "Camel case" style
// e.g., "thisIsATest" -> "This is a test"
export const camelCaseToSentenceCase = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
    .toLowerCase() // Convert the whole string to lowercase
    .replace(/^./, (c) => c.toUpperCase()); // Capitalize the first character

// Replaces HTML escaped characters with their original characters
// e.g., '&#x22;' -> '"' (double quotes)
export const replaceEscapedChars = (html) =>
  html
    .replaceAll("&#x22;", "'") // Replace double quote escape sequence
    .replaceAll("&#x27;", "'") // Replace single quote escape sequence
    .replaceAll("&#x3C;", "<"); // Replace less-than sign escape sequence

// Converts a camelCase string to kebab-case
// e.g., "camelCaseString" -> "camel-case-string"
export const camelCaseToKebabCase = (s) =>
  s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(); // Insert hyphen between lowercase and uppercase letters

// Converts a kebab-case string to camelCase
// e.g., "kebab-case-string" -> "kebabCaseString"
export const kebabCaseToCamelCase = (s) =>
  s.replace(/-./g, (x) => x[1].toUpperCase()); // Convert each hyphen followed by a letter to uppercase
