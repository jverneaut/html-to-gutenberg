import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { setRootAttribute } from "#utils-html/index.js";

export default class RootUseBlockProps extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      setRootAttribute(this.asts[filename], "root-placeholder");
    }
  }
  generateRootProps(
    className = { jsValue: "", phpValue: "", isExpression: false },
    editorClassName = "",
  ) {
    const editorClass = editorClassName ? editorClassName.trim() : "";

    if ((!className || !className.jsValue) && !editorClass) {
      return `{ ...useBlockProps() }`;
    }

    let finalClassName;

    if (className?.isExpression) {
      finalClassName = editorClass
        ? `\`\${${className.jsValue}} ${editorClass}\``
        : className.jsValue;
    } else {
      const parts = [className?.jsValue, editorClass].filter(Boolean);
      finalClassName = `"${parts.join(" ")}"`;
    }

    return `{ ...useBlockProps({ className: ${finalClassName} }) }`;
  }

  processHTMLStringByFilename(filename, htmlString) {
    if (filename === PrinterEditJS.filename) {
      return htmlString.replace(
        "root-placeholder",
        this.generateRootProps(
          this.blockData._className,
          this.blockData._editorClassName,
        ),
      );
    }

    return htmlString;
  }
}
