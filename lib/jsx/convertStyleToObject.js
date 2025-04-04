import { visit } from "unist-util-visit";
import parse from "style-to-object";

const convertStyleToObject = (ast) => {
  visit(ast, "element", (node) => {
    const styleString = node.properties?.style;
    if (styleString) {
      try {
        const styleObject = {};

        const kebabCaseToCamelCase = (s) =>
          s.replace(/-./g, (x) => x[1].toUpperCase());

        const normalizeStyleString = (styleString) => {
          return styleString
            .replace(/\s*\n\s*/g, " ") // Replace newlines and surrounding whitespace with a single space
            .replace(/\s{2,}/g, " ") // Collapse multiple spaces into one
            .replace(/\(\s*/g, "(") // Remove space after opening (
            .replace(/\s*\)/g, ")") // Remove space before closing )
            .trim(); // Remove leading and trailing whitespace
        };

        parse(styleString, (name, value) => {
          styleObject[kebabCaseToCamelCase(name)] = normalizeStyleString(value);
        });

        node.properties.style = `{${JSON.stringify(styleObject)}}`;
      } catch (err) {
        console.warn("Failed to parse style string:", styleString, err);
      }
    }
  });
};

export default convertStyleToObject;
