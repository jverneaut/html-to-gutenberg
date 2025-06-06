import JSXElementTransformer from "./CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class CustomElementToolbarItem extends JSXElementTransformer {
  static JSXTagName = "ToolbarItem";
  static HTMLTagName = "toolbar-item";

  onMatch(node) {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasToolbarItemImport = true;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
