import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { getDataBindInfo } from "#utils-string/index.js";
import { deleteAttribute } from "#utils-html/index.js";
import { DATA_BIND_IFRAME_ELEMENT, DATA_BIND_TYPES } from "#constants";

export default class DataBindIframe extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_IFRAME_ELEMENT === node.tagName
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData._hasAttributesProps = true;

            node.properties.src = `$\${attributes.${dataBindInfo.key}}$$`;
          }
        }
      });
    }

    if (printerFilename === PrinterRenderPHP.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_IFRAME_ELEMENT === node.tagName
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            node.properties.src = `<?php echo wp_kses_post($attributes['${dataBindInfo.key}'] ?? ''); ?>`;
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
