import { toHtml } from "hast-util-to-html";

export default (node, type) => {
  const defaultValue = node.children
    ? toHtml(node.children)
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .join(" ")
    : null;

  if (defaultValue) {
    return {
      type,
      default: defaultValue,
    };
  }

  return {
    type,
  };
};
