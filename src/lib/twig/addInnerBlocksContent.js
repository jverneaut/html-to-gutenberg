import { visit } from "unist-util-visit";

const addInnerBlocksContent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      node.type = "text";
      node.value = "{{ content }}";
    }
  });
};

export default addInnerBlocksContent;
