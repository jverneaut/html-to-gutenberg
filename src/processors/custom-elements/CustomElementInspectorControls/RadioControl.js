import CustomElementJSXTransformer from "../CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName, getOptions } from "#utils-html/index.js";

export default class RadioControl extends CustomElementJSXTransformer {
  static JSXTagName = "RadioControl";
  static HTMLTagName = "radio-control";

  onMatch(node) {
    this.blockData._hasWordPressComponents = true;
    this.blockData._hasRadioControlImport = true;

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
