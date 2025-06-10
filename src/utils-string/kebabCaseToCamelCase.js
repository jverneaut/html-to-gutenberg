// Converts a kebab-case string to camelCase
// e.g., "hello-world" -> "helloWorld"
export default (str) => str.replace(/-./g, (x) => x[1].toUpperCase());
