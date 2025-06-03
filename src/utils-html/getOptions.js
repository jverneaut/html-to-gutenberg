import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";

export default (node) => {
  const options = [];

  visit(node, "element", (node) => {
    if (node.tagName.endsWith("-option")) {
      const label = node.children
        ? toHtml(node.children)
            .trim()
            .split("\n")
            .map((line) => line.trim())
            .join(" ")
        : false;

      if (node.properties?.value !== undefined) {
        if (label) {
          options.push({
            label: label,
            value: node.properties?.value,
          });
        } else {
          options.push({
            label: node.properties.value,
            value: node.properties.value,
          });
        }
      } else {
        if (label) {
          options.push({
            label: label,
            value: label,
          });
        }
      }
    }
  });

  return options;
};
