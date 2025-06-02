import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { deleteAttribute } from "#utils-html/index.js";
import { DATA_BIND_INPUT_ELEMENTS } from "#constants";

export default class DataBindInput extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_INPUT_ELEMENTS.includes(node.tagName)
        ) {
          this.blockData._hasAttributesProps = true;

          switch (node.properties.type) {
            case "checkbox":
              node.properties.checked = `$\${attributes.${node.properties.dataBind}}$$`;
              node.properties.onChange = `$\${(e) => setAttributes({ ${node.properties.dataBind}: e.target.checked })}$$`;

              break;

            default:
              node.properties.value = `$\${attributes.${node.properties.dataBind}}$$`;
              node.properties.onChange = `$\${(e) => setAttributes({ ${node.properties.dataBind}: e.target.value })}$$`;

              break;
          }
        }
      });
    }

    if (printerFilename === PrinterRenderPHP.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_INPUT_ELEMENTS.includes(node.tagName)
        ) {
          switch (node.properties.type) {
            case "checkbox":
              node.properties.checked = `$$<?= $attributes['${node.properties.dataBind}']; ?>$$`;

              break;

            default:
              node.properties.value = `$$<?= $attributes['${node.properties.dataBind}']; ?>$$`;

              break;
          }
        }
      });
    }
  }

  processAllAsts() {
    Object.values(this.asts).forEach((ast) => {
      deleteAttribute(ast, "dataBind");
    });
  }
}
