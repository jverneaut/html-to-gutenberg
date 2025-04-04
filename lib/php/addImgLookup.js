import { visit } from "unist-util-visit";

const addImgLookup = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataName && node.tagName === "img") {
      node.properties.src = `<?php echo esc_url($${node.properties.dataName}[0]); ?>`;
      node.properties.alt = `<?php echo esc_attr($${node.properties.dataName}_alt); ?>`;

      delete node.properties.dataName;
    }
  });
};

export default addImgLookup;
