import { DATA_BIND_TYPES } from "#constants";

export const parseRawValue = (rawValue) => {
  let parsedValue = null;
  let value = null;

  // First, try to convert array to string if possible
  try {
    if (Array.isArray(rawValue)) {
      parsedValue = rawValue.join(" ");
    } else {
      parsedValue = rawValue;
    }
  } catch {
    parsedValue = rawValue;
  }

  // Then, try to parse the value
  try {
    value = JSON.parse(parsedValue);
  } catch {
    value = parsedValue;
  }

  return value;
};

// Converts a string to sentence case (supports camelCase and kebab_case)
// e.g., "thisIsATest" -> "This is a test"
// e.g., "this_is_a_test" -> "This is a test"
export const toSentenceCase = (str) =>
  str
    .replace(/_/g, " ") // Replace _ character with space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before uppercase letters
    .toLowerCase() // Convert the whole string to lowercase
    .replace(/^./, (c) => c.toUpperCase()); // Capitalize the first character

// Converts a kebab-case string to Title Case
// e.g., "hello-world" -> "Hello World"
export const kebabCaseToTitleCase = (str) =>
  str
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize the first letter of each word

export const getDataBindInfo = (dataBind) => {
  const splitDataBind = dataBind.replaceAll(" ", "").split(".");

  switch (splitDataBind.length) {
    case 0:
    case 1:
      return {
        type: DATA_BIND_TYPES.attributes,
        key: dataBind,
      };

    case 2:
      switch (splitDataBind[0]) {
        case DATA_BIND_TYPES.attributes:
          return {
            type: DATA_BIND_TYPES.attributes,
            key: splitDataBind[1],
          };
        case DATA_BIND_TYPES.postMeta:
          return {
            type: DATA_BIND_TYPES.postMeta,
            key: splitDataBind[1],
          };
        default:
          throw new Error(`Unrecognized dataBind format: ${dataBind}`);
      }

    default:
      throw new Error(`Unrecognized dataBind format: ${dataBind}`);
  }
};
