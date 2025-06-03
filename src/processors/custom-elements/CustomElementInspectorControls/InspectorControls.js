import JSXElementTransformer from "../CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class InspectorControls extends JSXElementTransformer {
  static JSXTagName = "InspectorControls";
  static HTMLTagName = "inspector-controls";

  onMatch() {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasInspectorControlsImport = true;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
