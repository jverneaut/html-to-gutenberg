import { visit } from "unist-util-visit";

const addImgLookup = (ast) => {
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute && node.tagName === "img") {
      node.properties.src = `{{ get_image(attributes.${node.properties.dataAttribute}).src }}`;
      node.properties.alt = `{{ get_image(attributes.${node.properties.dataAttribute}).alt }}`;

      delete node.properties.dataAttribute;
    }
  });
};

export default addImgLookup;
