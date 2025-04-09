import { visit } from "unist-util-visit";

const addInnerBlocksComponent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      node.type = "text";
      node.value = "{children}";
    }
  });
};

export default addInnerBlocksComponent;
