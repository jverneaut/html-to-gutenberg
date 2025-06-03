import JSXElementTransformer from "../CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class CheckboxControl extends JSXElementTransformer {
  static JSXTagName = "CheckboxControl";
  static HTMLTagName = "checkbox-control";

  onMatch(node) {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasCheckboxControlImport = true;

    delete node.children;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
