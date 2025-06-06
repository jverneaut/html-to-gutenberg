import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { setRootAttribute } from "#utils-html/index.js";

export default class RootBlockWrapperAttributes extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterRenderPHP.filename) {
      setRootAttribute(this.asts[filename], "root-placeholder");
    }
  }

  generateRootProps(
    className = { jsValue: "", phpValue: "", isExpression: false },
  ) {
    const wrapperAttributes = className
      ? className.isExpression
        ? `['class' => ${className.phpValue}]`
        : `['class' => '${className.phpValue}']`
      : "";

    return `<?php echo get_block_wrapper_attributes(${wrapperAttributes}); ?>`;
  }

  processHTMLStringByFilename(filename, htmlString) {
    if (filename === PrinterRenderPHP.filename) {
      return htmlString.replace(
        "root-placeholder",
        this.generateRootProps(this.blockData._className),
      );
    }

    return htmlString;
  }
}
