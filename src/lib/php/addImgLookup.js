import { visit } from "unist-util-visit";

const addImgLookup = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute && node.tagName === "img") {
      node.properties.src = `<?php echo esc_url($${node.properties.dataAttribute}[0]); ?>`;
      node.properties.alt = `<?php echo esc_attr($${node.properties.dataAttribute}_alt); ?>`;

      delete node.properties.dataAttribute;
    }
  });
};

export default addImgLookup;
