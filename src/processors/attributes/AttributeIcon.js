import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { visit } from "unist-util-visit";

export default class AttributeIcon extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        // If the node is a React component (starts with a capital letter)
        if (node.tagName.charAt(0) === node.tagName.charAt(0).toUpperCase()) {
          if (node.properties.icon) {
            const icon = node.properties.icon.trim();
            this.blockData._icons.push(icon);

            node.properties.icon = `$\${${icon}}$$`;
          }
        }
      });
    }
  }
}
