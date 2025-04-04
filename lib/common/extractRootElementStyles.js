import { visit } from "unist-util-visit";

const extractRootElementStyles = (ast) => {
  let styles = null;

  visit(ast, "root", (node) => {
    if (node.type === "root") {
      const childrenElements = node.children.filter(
        (el) => el.type === "element",
      );

      if (childrenElements.length) {
        const children = childrenElements[0];

        if (children.properties.dataStyles) {
          styles = children.properties.dataStyles;
          delete children.properties.dataStyles;
        }
      }
    }
  });

  return styles;
};

export default extractRootElementStyles;
