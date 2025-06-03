import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { visit } from "unist-util-visit";
import { deleteTagName } from "#utils-html/index.js";
import { parseRawValue } from "#utils-string/index.js";

export default class CustomElementRootBlockAttribute extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (node.tagName === "block-attribute") {
          if (node.properties.name) {
            this.blockData.attributes[node.properties.name] = {};

            const defaultValue =
              node.properties.default !== undefined
                ? parseRawValue(node.properties.default)
                : undefined;

            if (defaultValue !== undefined) {
              this.blockData.attributes[node.properties.name].default =
                defaultValue;
            }

            if (node.properties.type !== undefined) {
              Object.assign(this.blockData.attributes[node.properties.name], {
                type: node.properties.type,
              });
            } else {
              if (node.properties.default !== undefined) {
                switch (typeof defaultValue) {
                  case "number":
                    if (Number.isInteger(defaultValue)) {
                      Object.assign(
                        this.blockData.attributes[node.properties.name],
                        {
                          type: "integer",
                        },
                      );
                    } else {
                      Object.assign(
                        this.blockData.attributes[node.properties.name],
                        {
                          type: "number",
                        },
                      );
                    }

                    break;

                  case "boolean":
                    Object.assign(
                      this.blockData.attributes[node.properties.name],
                      {
                        type: "boolean",
                      },
                    );

                    break;

                  default:
                  case "string":
                    Object.assign(
                      this.blockData.attributes[node.properties.name],
                      {
                        type: "string",
                      },
                    );

                    break;
                }
              } else {
                Object.assign(this.blockData.attributes[node.properties.name], {
                  type: "string",
                });
              }
            }
          }
        }
      });
    }
  }

  processAllAsts() {
    Object.values(this.asts).forEach((ast) => {
      deleteTagName(ast, "block-attribute");
    });
  }
}
