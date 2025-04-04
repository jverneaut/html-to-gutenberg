import { visit } from "unist-util-visit";

const addTextLookup = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataName && node.tagName !== "img") {
      node.children = [
        {
          type: "text",
          value: `<?php echo wp_kses_post($attributes['${node.properties.dataName}'] ?? ''); ?>`,
        },
      ];

      delete node.properties.dataName;
    }
  });
};

export default addTextLookup;
