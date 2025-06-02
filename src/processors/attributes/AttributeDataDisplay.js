import { visit } from "unist-util-visit";
import { remove } from "unist-util-remove";
import flatmap from "unist-util-flatmap";

import ProcessorBase from "#processors/ProcessorBase.js";

import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

export default class AttributeDataDisplay extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      const ast = this.asts[printerFilename];

      // Remove nodes that are frontend-only
      remove(ast, (node) => {
        return (
          node.properties &&
          node.properties.dataDisplay &&
          node.properties.dataDisplay === "frontend"
        );
      });

      flatmap(ast, (node) => {
        if (
          node.properties &&
          node.properties.dataDisplay &&
          node.properties.dataDisplay === "selected"
        ) {
          this.blockData._hasSelected = true;

          return [
            {
              type: "text",
              value: "$$${isSelected && ($$$",
            },
            node,
            {
              type: "text",
              value: "$$$)}$$$",
            },
          ];
        }

        if (
          node.properties &&
          node.properties.dataDisplay &&
          node.properties.dataDisplay === "not-selected"
        ) {
          this.blockData._hasSelected = true;

          return [
            {
              type: "text",
              value: "$$${!isSelected && ($$$",
            },
            node,
            {
              type: "text",
              value: "$$$)}$$$",
            },
          ];
        }

        return [node];
      });

      // Delete the dataDisplay attribute
      visit(ast, "element", (node) => {
        if (node.properties.dataDisplay) {
          delete node.properties.dataDisplay;
        }
      });
    }

    if (printerFilename === PrinterRenderPHP.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        // Remove nodes that are frontend-only
        remove(this.asts[printerFilename], (node) => {
          return (
            node.properties &&
            node.properties.dataDisplay &&
            ["editor", "selected", "not-selected"].includes(
              node.properties.dataDisplay,
            )
          );
        });

        // Delete the dataDisplay attribute
        if (node.properties.dataDisplay) {
          delete node.properties.dataDisplay;
        }
      });
    }
  }
}
