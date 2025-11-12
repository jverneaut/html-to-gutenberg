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
    style = null,
  ) {
    const hasClassName = Boolean(className);
    className = className ?? { jsValue: "", phpValue: "", isExpression: false };

    const attributesParts = [];

    if (hasClassName) {
      attributesParts.push(
        className.isExpression
          ? `'class' => ${className.phpValue}`
          : `'class' => '${className.phpValue}'`,
      );
    }

    if (style?.phpValue) {
      const sanitizedStyle = style.phpValue.replace(/'/g, "\\'");
      attributesParts.push(`'style' => '${sanitizedStyle}'`);
    }

    const wrapperAttributes = attributesParts.length
      ? `[${attributesParts.join(", ")}]`
      : "";

    return `<?php echo get_block_wrapper_attributes(${wrapperAttributes}); ?>`;
  }

  processHTMLStringByFilename(filename, htmlString) {
    if (filename === PrinterRenderPHP.filename) {
      return htmlString.replace(
        "root-placeholder",
        this.generateRootProps(
          this.blockData._className,
          this.blockData._rootStyle,
        ),
      );
    }

    return htmlString;
  }
}
