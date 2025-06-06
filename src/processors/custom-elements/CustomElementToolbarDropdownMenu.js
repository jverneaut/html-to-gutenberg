import JSXElementTransformer from "./CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName, getOptions } from "#utils-html/index.js";

export default class CustomElementToolbarButton extends JSXElementTransformer {
  static JSXTagName = "ToolbarDropdownMenu";
  static HTMLTagName = "toolbar-dropdown-menu";

  onMatch(node) {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasToolbarDropdownMenuImport = true;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
