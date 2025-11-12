import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { visit } from "unist-util-visit";

import { parseStyleString } from "#utils-style/index.js";

export default class AttributeStyle extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        const styleString = node.properties?.style;

        if (styleString) {
          try {
            const styleObject = parseStyleString(styleString);

            node.properties.style = `$\${${JSON.stringify(styleObject)}}$$`;
          } catch (err) {
            console.warn("Failed to parse style string:", styleString, err);
          }
        }
      });
    }
  }
}
