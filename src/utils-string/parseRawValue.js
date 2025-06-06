export default (rawValue) => {
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
