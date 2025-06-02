import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { visit } from "unist-util-visit";

const deprecateElement = (ast, oldTagName, newTagName) => {
  const errors = [];

  visit(ast, "element", (node) => {
    if (node.tagName === oldTagName) {
      errors.push(
        `The <${oldTagName}> element is deprecated. Please use the <${newTagName}> element instead.`,
      );
    }
  });

  return errors;
};

const deprecateAttribute = (ast, oldAttributeName, newAttributeName) => {
  const errors = [];

  visit(ast, "element", (node) => {
    const camelCasedOldAttributeName = oldAttributeName
      .split("-")
      .map((str, index) =>
        index === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1),
      )
      .join("");
    if (node.properties[camelCasedOldAttributeName] !== undefined) {
      errors.push(
        `The <${oldAttributeName}> attribute is deprecated. Please use the <${newAttributeName}> attribute instead.`,
      );
    }
  });

  return errors;
};

export default class GlobalDepreciations extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      const errors = [
        ...deprecateElement(this.asts[filename], "blocks", "inner-blocks"),
        ...deprecateAttribute(
          this.asts[filename],
          "data-attribute",
          "data-bind",
        ),
      ];

      if (errors.length) {
        throw new Error(errors.join("\n"));
      }
    }
  }
}
