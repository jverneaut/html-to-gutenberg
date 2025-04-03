import { visit } from "unist-util-visit";

const addImgLookup = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataName && node.tagName === "img") {
      node.properties.src = `{{ get_image(attributes.${node.properties.dataName}).src }}`;
      node.properties.alt = `{{ get_image(attributes.${node.properties.dataName}).alt }}`;

      delete node.properties.dataName;
    }
  });
};

export default addImgLookup;
