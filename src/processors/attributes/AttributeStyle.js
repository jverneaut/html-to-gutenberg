import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { visit } from "unist-util-visit";

import { buildStyleObjectExpression } from "#utils-style/index.js";

export default class AttributeStyle extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        const styleString = node.properties?.style;

        if (styleString) {
          try {
            const styleExpression = buildStyleObjectExpression(
              styleString,
              this,
            );

            if (styleExpression) {
              node.properties.style = `$\${${styleExpression}}$$`;
            }
          } catch (err) {
            console.warn("Failed to parse style string:", styleString, err);
          }
        }
      });
    }
  }
}
