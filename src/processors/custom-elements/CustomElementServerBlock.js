import JSXElementTransformer from "./CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";

export default class CustomElementServerBlock extends JSXElementTransformer {
  static JSXTagName = "ServerSideRender";
  static HTMLTagName = "server-block";

  static attributesMapping = [
    { html: "name", jsx: "block" },
    { html: true, jsx: false },
  ];

  onMatch(node) {
    this.blockData._hasServerSideRender = true;
    this.blockData._hasAttributesProps = true;

    node.properties.attributes = `$\${ attributes }$$`;
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
