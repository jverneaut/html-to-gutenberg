import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { parseStyleString } from "#utils-style/index.js";
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
          const styleObject = parseStyleString(normalizedStyle);

          this.blockData._rootStyle = {
            jsValue: JSON.stringify(styleObject),
            phpValue: normalizedStyle,
          };

          shouldRemoveStyle = true;
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
