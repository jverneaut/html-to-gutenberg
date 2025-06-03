import { visit } from "unist-util-visit";

export default (ast, attributeName) => {
  let rootAttribute = undefined;

  visit(ast, "root", (node) => {
    const childrenElements = node.children.filter(
      (el) => el.type === "element",
    );

    if (childrenElements.length) {
      const children = childrenElements[0];
      if (children.properties[attributeName]) {
        rootAttribute = children.properties[attributeName];
      }
    }
  });

  return rootAttribute;
};
