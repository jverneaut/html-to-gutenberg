import JSXElementTransformer from "../CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class PanelBody extends JSXElementTransformer {
  static JSXTagName = "PanelBody";
  static HTMLTagName = "panel-body";

  onMatch() {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasPanelBodyImport = true;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
