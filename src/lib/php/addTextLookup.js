import { visit } from "unist-util-visit";

const addTextLookup = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute && node.tagName !== "img") {
      node.children = [
        {
          type: "text",
          value: `<?php echo wp_kses_post($attributes['${node.properties.dataAttribute}'] ?? ''); ?>`,
        },
      ];

      delete node.properties.dataAttribute;
    }
  });
};

export default addTextLookup;
