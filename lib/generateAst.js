import { unified } from "unified";
import rehypeParse from "rehype-parse";

/**
 * Generates an Abstract Syntax Tree (AST) from the provided HTML string.
 *
 * @param {string} inputHTML - The HTML string to be parsed into an AST.
 * @returns {Object} - The generated AST representation of the input HTML.
 */
const generateAst = (inputHTML) => {
  const ast = unified().use(rehypeParse, { fragment: true }).parse(inputHTML);
  return ast;
};

export default generateAst;
