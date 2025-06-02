import JSXElementTransformer from "./CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class CustomElementToolbar extends JSXElementTransformer {
  static JSXTagName = "ToolbarGroup";
  static HTMLTagName = "toolbar-group";

  onMatch(node) {
    this.blockData._hasToolbarGroupImport = true;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
