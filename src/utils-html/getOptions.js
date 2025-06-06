import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";

export default (node) => {
  const options = [];

  visit(node, "element", (node) => {
    if (node.tagName.endsWith("-option")) {
      const option = {};

      const label = node.children
        ? toHtml(node.children)
            .trim()
            .split("\n")
            .map((line) => line.trim())
            .join(" ")
        : false;

      if (node.properties?.icon) {
        option.icon = node.properties.icon.trim();
      }

      if (node.properties?.value !== undefined) {
        if (label) {
          Object.assign(option, {
            label: label,
            value: node.properties?.value,
          });
        } else {
          Object.assign(option, {
            label: node.properties?.value,
            value: node.properties?.value,
          });
        }
      } else {
        if (label) {
          Object.assign(option, {
            label: label,
            value: label,
          });
        }
      }

      options.push(option);
    }
  });

  return options;
};
