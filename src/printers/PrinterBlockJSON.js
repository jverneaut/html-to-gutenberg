import PrinterBase from "./PrinterBase.js";

import { format } from "prettier";
import pluginESTree from "prettier/plugins/estree.js";
import pluginBabel from "prettier/plugins/babel.js";

export default class PrinterBlockJSON extends PrinterBase {
  static filename = "block.json";
  static skipAst = true;

  print() {
    const blockDefinition = {
      name: this.blockData.name,
      title: this.blockData.title,
      textdomain: this.blockData.textdomain,
      ...(this.blockData.description
        ? {
            description: this.blockData.description,
          }
        : {}),
      $schema: "https://schemas.wp.org/trunk/block.json",
      apiVersion: 3,
      version: this.blockData.version,
      category: this.blockData.category,
      ...(this.blockData.icon ? { icon: this.blockData.icon } : {}),
      example: {},
      ...(this.blockData.styles.length
        ? { styles: this.blockData.styles }
        : {}),
      ...(this.blockData.parent ? { parent: this.blockData.parent } : {}),
      attributes: {
        align: { type: "string", default: "full" },
        ...this.blockData.attributes,
      },
      supports: {
        html: false,
        align: ["full"],
      },
      editorScript: "file:./index.js",
      render: "file:./render.php",
      ...(this.blockData.style ? { style: `file:./style-index.css` } : {}),
      ...(this.blockData.editorStyle
        ? { editorStyle: `file:./index.css` }
        : {}),
      ...(this.blockData.viewScript
        ? { viewScript: `file:./${this.blockData.viewScript}` }
        : {}),
    };

    return format(JSON.stringify(blockDefinition), {
      parser: "json",
      plugins: [pluginESTree, pluginBabel],
    });
  }
}
