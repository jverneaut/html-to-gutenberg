import { visit } from "unist-util-visit";

export default (ast, attributeName) => {
  visit(ast, "element", (node) => {
    if (node.properties[attributeName]) {
      delete node.properties[attributeName];
    }
  });
};
