import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { setRootAttribute } from "#html-utils/index.js";

export default class RootUseBlockProps extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      setRootAttribute(this.asts[filename], "root-placeholder");
    }
  }

  generateRootProps(className = "", editorClassName = "") {
    const concatenatedClasses = [className, editorClassName]
      .filter((str) => str && str.trim() !== "")
      .join(" ");

    const blockProps = `{...useBlockProps(${
      concatenatedClasses ? `{ className: "${concatenatedClasses}" }` : ""
    })}`;

    return blockProps;
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
