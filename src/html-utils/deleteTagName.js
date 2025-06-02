import { remove } from "unist-util-remove";

export default (ast, tagName) => {
  remove(ast, (node) => node.tagName === tagName);
};
