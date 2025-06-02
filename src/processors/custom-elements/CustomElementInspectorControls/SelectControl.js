import CustomElementJSXTransformer from "../CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName, getOptions } from "#utils-html/index.js";

export default class SelectControl extends CustomElementJSXTransformer {
  static JSXTagName = "SelectControl";
  static HTMLTagName = "select-control";

  onMatch(node) {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasSelectControlImport = true;

    const options = getOptions(node);
    if (options.length) {
      node.properties.options = `$\${${JSON.stringify(options)}}$$`;
    }

    delete node.children;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
