import { visit } from "unist-util-visit";

export default (ast, attributeName, attributeValue = true) => {
  visit(ast, "root", (node) => {
    const childrenElements = node.children.filter(
      (el) => el.type === "element",
    );

    if (childrenElements.length) {
      const children = childrenElements[0];

      children.properties[attributeName] = attributeValue;
    }
  });
};
