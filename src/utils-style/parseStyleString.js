import parse from "style-to-object";

const kebabCaseToCamelCase = (value) =>
  value.replace(/-./g, (match) => match[1].toUpperCase());

const normalizeStyleValue = (value) =>
  `${value}`
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*/g, "(")
    .replace(/\s*\)/g, ")")
    .trim();

export default function parseStyleString(styleString = "") {
  const styleObject = {};

  parse(styleString, (name, value) => {
    styleObject[kebabCaseToCamelCase(name)] = normalizeStyleValue(value);
  });

  return styleObject;
}
