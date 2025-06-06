import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { visit } from "unist-util-visit";
import { parseAttributeExpression } from "#utils-string/index.js";

export default class GlobalAttributeExpression extends ProcessorBase {
  processAstByFilename(filename) {
    if (
      filename === PrinterEditJS.filename ||
      filename === PrinterRenderPHP.filename
    ) {
      visit(this.asts[filename], "element", (node) => {
        Object.entries(node.properties).forEach(([key, value]) => {
          const { jsValue, phpValue, isExpression } = parseAttributeExpression(
            value,
            this,
          );

          if (isExpression) {
            if (filename === PrinterEditJS.filename) {
              node.properties[key] = `$\${${jsValue}}$$`;
            }

            if (filename === PrinterRenderPHP.filename) {
              node.properties[key] = `<?= ${phpValue}; ?>`;
            }
          }
        });
      });
    }
  }
}
