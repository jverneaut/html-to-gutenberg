import JSXElementTransformer from "./CustomElementJSXTransformer.js";

import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";
import { deleteTagName } from "#utils-html/index.js";
import { kebabCaseToCamelCase } from "#utils-string/index.js";

export default class CustomElementToolbarItem extends JSXElementTransformer {
  static JSXTagName = "ContentPicker";
  static HTMLTagName = "content-picker";

  onMatch(node) {
    this.blockData._hasContentPickerImport = true;

    Object.entries(node.properties).forEach(([key, value]) => {
      const camelCased = kebabCaseToCamelCase(key);

      if (key !== camelCased) {
        node.properties[camelCased] = value;
        delete node.properties[key];
      }
    });

    // Convert string to array
    if (node.properties.contentTypes) {
      node.properties.contentTypes = `$\${${JSON.stringify(node.properties.contentTypes.split(" "))}}$$`;
    }

    // Convert string to number
    if (node.properties.maxContentItems) {
      node.properties.maxContentItems = `$\${${node.properties.maxContentItems}}$$`;
    }
  }

  processAstByFilename(filename) {
    super.processAstByFilename(filename);

    if (filename === PrinterRenderPHP.filename) {
      deleteTagName(this.asts[filename], this.constructor.HTMLTagName);
    }
  }
}
