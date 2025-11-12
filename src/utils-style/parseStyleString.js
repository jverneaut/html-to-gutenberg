import parse from "style-to-object";

import {
  kebabCaseToCamelCase,
  parseAttributeExpression,
} from "#utils-string/index.js";

const encodeClosingBraces = (value) => value.replace(/}/g, "\uF000");
const decodeClosingBraces = (value) => value.replace(/\uF000/g, "}");

export const normalizeStyleValue = (value) =>
  `${value}`
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*/g, "(")
    .replace(/\s*\)/g, ")")
    .trim();

export const buildStyleObjectExpression = (
  styleString = "",
  processorInstance,
) => {
  const entries = [];

  const unwrapSimpleTemplateLiteral = (expression) => {
    if (!expression.startsWith("`") || !expression.endsWith("`")) {
      return expression;
    }

    const innerTemplate = expression.slice(1, -1);
    const match = innerTemplate.match(/^\$\{([\s\S]+)\}$/);

    return match ? match[1] : expression;
  };

  parse(encodeClosingBraces(styleString), (name, value) => {
    const normalizedValue = normalizeStyleValue(decodeClosingBraces(value));
    const { jsValue, isExpression } = parseAttributeExpression(
      normalizedValue,
      processorInstance,
    );

    const expression = isExpression
      ? unwrapSimpleTemplateLiteral(jsValue)
      : JSON.stringify(normalizedValue);

    entries.push([kebabCaseToCamelCase(name), expression]);
  });

  if (!entries.length) {
    return null;
  }

  const propertiesString = entries
    .map(([propertyName, expression]) => `${propertyName}: ${expression}`)
    .join(", ");

  return `{ ${propertiesString} }`;
};

export default function parseStyleString(styleString = "") {
  const styleObject = {};

  parse(encodeClosingBraces(styleString), (name, value) => {
    styleObject[kebabCaseToCamelCase(name)] =
      normalizeStyleValue(decodeClosingBraces(value));
  });

  return styleObject;
}
