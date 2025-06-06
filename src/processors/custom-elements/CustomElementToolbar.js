import JSXElementTransformer from "./CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class CustomElementToolbar extends JSXElementTransformer {
  static JSXTagName = "Toolbar";
  static HTMLTagName = "toolbar";

  onMatch(node) {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasToolbarImport = true;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
