import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { visit } from "unist-util-visit";
import { source } from "unist-util-source";
import { remove } from "unist-util-remove";

import preventMultipleInnerBlocks from "./preventMultipleInnerBlocks.js";
import preventMultipleRootElements from "./preventMultipleRootElements.js";
import preventNestedFields from "./preventNestedFields.js";
import preventSpecialCharacters from "./preventSpecialCharacters.js";
import preventTemplatedBlockNotInAllowedBlocks from "./preventTemplatedBlockNotInAllowedBlocks.js";

/**
 * Parses an HTML string into a HAST (HTML Abstract Syntax Tree),
 * removes all comments, and restores the original casing of attribute names
 * (e.g., 'data-id' instead of 'data-Id') when recoverable from the original input.
 *
 * This is useful when you want to preserve the author's original attribute naming,
 * especially for frameworks or rendering engines that rely on exact casing.
 *
 * @param {string} inputHTML - Raw HTML string to parse.
 * @returns {Object} - HAST object representing the HTML structure.
 */
const generateAst = (inputHTML) => {
  // Step 1: Parse the HTML string to a HAST tree (in fragment mode)
  const ast = unified()
    .use(rehypeParse, { fragment: true, verbose: true })
    .parse(inputHTML);

  // Step 2: Remove all HTML comments from the AST
  remove(ast, "comment");

  // Step 3: Attempt to restore original attribute casing from source
  visit(ast, "element", (node) => {
    if (!node.properties || !node.data?.position?.properties) return;

    const originalAttributes = node.data.position.properties;
    const updatedProperties = {};

    for (const [key, value] of Object.entries(node.properties)) {
      const original = source(inputHTML, originalAttributes[key]);

      if (!original) {
        updatedProperties[key] = value;
        continue;
      }

      const [rawAttrName] = original.split("=");
      const isSameAttrLowercase =
        rawAttrName && rawAttrName.toLowerCase() === key && rawAttrName !== key;

      if (isSameAttrLowercase) {
        updatedProperties[rawAttrName] = value;
      } else {
        updatedProperties[key] = value;
      }
    }

    node.properties = updatedProperties;
  });

  // 4. Add useful errors for common failing use cases
  preventMultipleInnerBlocks(ast);
  preventMultipleRootElements(ast);
  preventNestedFields(ast);
  preventSpecialCharacters(ast);
  preventTemplatedBlockNotInAllowedBlocks(ast);

  return ast;
};

export default generateAst;
