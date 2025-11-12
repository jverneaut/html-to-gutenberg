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
    style = null,
  ) {
    className = className ?? { jsValue: "", phpValue: "", isExpression: false };
    const editorClass = editorClassName ? editorClassName.trim() : "";
    const hasStyle = Boolean(style?.jsValue);
    const hasClass = Boolean(className?.jsValue) || Boolean(editorClass.length);

    if (!hasClass && !hasStyle) {
      return `{ ...useBlockProps() }`;
    }

    const props = [];

    if (hasClass) {
      let finalClassName;

      if (className?.isExpression) {
        finalClassName = editorClass
          ? `\`\${${className.jsValue}} ${editorClass}\``
          : className.jsValue;
      } else {
        const parts = [className?.jsValue, editorClass].filter(Boolean);
        finalClassName = `"${parts.join(" ")}"`;
      }

      props.push(`className: ${finalClassName}`);
    }

    if (hasStyle) {
      props.push(`style: ${style.jsValue}`);
    }

    return `{ ...useBlockProps({ ${props.join(", ")} }) }`;
  }

  processHTMLStringByFilename(filename, htmlString) {
    if (filename === PrinterEditJS.filename) {
      return htmlString.replace(
        "root-placeholder",
        this.generateRootProps(
          this.blockData._className,
          this.blockData._editorClassName,
          this.blockData._rootStyle,
        ),
      );
    }

    return htmlString;
  }
}
