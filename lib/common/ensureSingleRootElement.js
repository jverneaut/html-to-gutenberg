import { visit } from "unist-util-visit";

const ensureSingleRootElement = (ast) => {
  visit(ast, "root", (node) => {
    if (node.type === "root") {
      const childrenElement = node.children.filter(
        (el) => el.type === "element",
      );

      if (childrenElement.length > 1) {
        throw new Error(
          "Multiple root elements found. Only one root element is allowed.",
        );
      }
    }
  });
};

export default ensureSingleRootElement;
