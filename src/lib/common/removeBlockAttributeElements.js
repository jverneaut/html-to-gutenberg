import { remove } from "unist-util-remove";

const removeBlockAttributeElements = (ast) => {
  // Remove <block-attribute> elements
  remove(ast, (node) => {
    return node.tagName === "block-attribute";
  });
};

export default removeBlockAttributeElements;
