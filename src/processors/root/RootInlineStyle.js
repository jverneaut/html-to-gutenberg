import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { buildStyleObjectExpression } from "#utils-style/index.js";
import { parseAttributeExpression } from "#utils-string/index.js";
import { visit } from "unist-util-visit";

const TARGET_FILENAMES = new Set([
  PrinterEditJS.filename,
  PrinterRenderPHP.filename,
]);

export default class RootInlineStyle extends ProcessorBase {
  processAstByFilename(filename) {
    if (!TARGET_FILENAMES.has(filename)) {
      return;
    }

    visit(this.asts[filename], "root", (node) => {
      const rootElement = node.children?.find(
        (child) => child.type === "element",
      );

      if (!rootElement?.properties?.style) {
        return;
      }

      const normalizedStyle = this.normalizeStyleValue(
        rootElement.properties.style,
      );

      if (!normalizedStyle) {
        if (this.blockData._rootStyle) {
          delete rootElement.properties.style;
        }
        return;
      }

      let shouldRemoveStyle = Boolean(this.blockData._rootStyle);

      if (!this.blockData._rootStyle) {
        try {
          const styleExpression = buildStyleObjectExpression(
            normalizedStyle,
            this,
          );

          if (styleExpression) {
            const expressionResult = parseAttributeExpression(
              normalizedStyle,
              this,
            );

            const phpValue = expressionResult.isExpression
              ? expressionResult.phpValue
              : `'${normalizedStyle.replace(/'/g, "\\'")}'`;

            this.blockData._rootStyle = {
              jsValue: styleExpression,
              phpValue,
            };

            shouldRemoveStyle = true;
          }
        } catch (err) {
          console.warn("Failed to parse style string:", normalizedStyle, err);
          shouldRemoveStyle = false;
        }
      }

      if (shouldRemoveStyle) {
        delete rootElement.properties.style;
      }
    });
  }

  normalizeStyleValue(styleValue) {
    if (Array.isArray(styleValue)) {
      return styleValue.join(" ").trim();
    }

    if (typeof styleValue === "string") {
      return styleValue.trim();
    }

    if (styleValue == null) {
      return "";
    }

    return `${styleValue}`.trim();
  }
}
