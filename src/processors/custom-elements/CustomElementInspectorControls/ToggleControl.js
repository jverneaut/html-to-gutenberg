import JSXElementTransformer from "../CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class ToggleControl extends JSXElementTransformer {
  static JSXTagName = "ToggleControl";
  static HTMLTagName = "toggle-control";

  onMatch(node) {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasToggleControlImport = true;

    delete node.children;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
