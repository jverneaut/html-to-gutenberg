import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { visit } from "unist-util-visit";

// TODO: Move errors in the implementations files
export default class GlobalErrors extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      const errors = [];

      let numberOfInnerBlocks = 0;

      visit(this.asts[filename], "root", (node) => {
        if (node.type === "root") {
          const childrenElement = node.children.filter(
            (el) => el.type === "element",
          );

          if (childrenElement.length > 1) {
            errors.push(
              "Multiple root elements found. Only one root element is allowed.",
            );
          }
        }
      });

      visit(this.asts[filename], "element", (node) => {
        // Prevent nested data binds
        if (node.properties.dataBind) {
          const nestedField = node.children?.find(
            (child) => child.properties?.dataBind,
          );

          if (nestedField) {
            errors.push(`Fields cannot be nested.

    Context:
      Parent element: <${node.tagName}> with dataBind: ${node.properties.dataBind}
      Nested element: <${nestedField.tagName}> with dataBind: ${nestedField.properties.dataBind}
            `);
          }
        }

        // Prevent multiple inner-blocks
        if (node.tagName === "inner-blocks") {
          numberOfInnerBlocks++;
        }

        // Prevent whitespace and dashed in data-bind
        if (node.properties.dataBind) {
          if (/[\s\-]/.test(node.properties.dataBind)) {
            const errorMessage = `"data-bind" attributes should not contain whitespace or dashes (-).

    Context:
      Element: <${node.tagName}> with data-bind: ${node.properties.dataBind}
            `;
            errors.push(errorMessage);
          }
        }

        if (
          node.properties.allowedBlocks !== undefined &&
          node.properties.allowedBlocks !== "all"
        ) {
          const allowedBlocks = [
            ...new Set(
              node.properties.allowedBlocks
                .split(" ")
                .map((block) => block.trim()),
            ),
          ];

          const childBlocks = node.children.filter(
            (el) => el.tagName === "inner-block",
          );

          childBlocks.forEach((childBlock) => {
            if (!allowedBlocks.includes(childBlock.properties.name)) {
              const errorMessage = `Templated block not in allowedBlocks.

    Context:
      Templated block: <${childBlock.properties.name}>
      allowedBlocks: [${allowedBlocks.map((el) => `"${el}"`).join(", ")}]`;
              errors.push(errorMessage);
            }
          });
        }
      });

      if (numberOfInnerBlocks > 1) {
        errors.push("Blocks cannot have multiple <inner-blocks> elements.");
      }

      if (errors.length) {
        throw new Error(errors.join("\n\n"));
      }
    }
  }
}
