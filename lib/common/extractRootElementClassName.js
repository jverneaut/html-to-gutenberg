import { visit } from "unist-util-visit";

const extractRootElementClassName = (ast) => {
  let className = null;

  visit(ast, "root", (node) => {
    if (node.type === "root") {
      const childrenElements = node.children.filter(
        (el) => el.type === "element",
      );

      if (childrenElements.length) {
        const children = childrenElements[0];

        if (children.properties.className) {
          className = children.properties.className.join(" ");

          delete children.properties.className;
        }
      }
    }
  });

  return className;
};

export default extractRootElementClassName;
