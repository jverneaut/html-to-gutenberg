import { unified } from "unified";
import rehypeParse from "rehype-parse";

import { visit } from "unist-util-visit";
import { source } from "unist-util-source";

/**
 * Generates an Abstract Syntax Tree (AST) from the provided HTML string.
 * Will replace attributes with their original case if a proper match is found.
 *
 * @param {string} inputHTML - The HTML string to be parsed into an AST.
 * @returns {Object} - The generated AST representation of the input HTML.
 */
const generateAst = (inputHTML) => {
  const ast = unified()
    .use(rehypeParse, { fragment: true, verbose: true })
    .parse(inputHTML);

  // Replace attributes names with their original case
  visit(ast, "element", (node) => {
    if (node.properties) {
      const propertiesToRename = [];

      Object.keys(node.properties).forEach((propertyName) => {
        const propertySource = source(
          inputHTML,
          node.data.position.properties[propertyName],
        );

        if (propertySource) {
          const attributeKeyValue = propertySource.split("=");

          if (attributeKeyValue.length) {
            const actualPropertyName = attributeKeyValue[0];
            if (
              propertyName !== actualPropertyName &&
              actualPropertyName.toLowerCase() === propertyName
            ) {
              propertiesToRename.push({
                before: propertyName,
                after: actualPropertyName,
              });
            }
          }
        }
      });

      if (propertiesToRename.length) {
        propertiesToRename.forEach(({ before, after }) => {
          Object.assign(node.properties, {
            [after]: node.properties[before],
          });

          delete node.properties[before];
        });
      }
    }
  });

  return ast;
};

export default generateAst;
