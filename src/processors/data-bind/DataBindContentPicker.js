import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { getDataBindInfo } from "#utils-string/index.js";
import { deleteAttribute } from "#utils-html/index.js";
import { DATA_BIND_CONTENT_PICKER_ELEMENT, DATA_BIND_TYPES } from "#constants";

export default class DataBindContentPicker extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_CONTENT_PICKER_ELEMENT === node.tagName
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData._hasAttributesProps = true;
            this.blockData.attributes = {
              ...this.blockData.attributes,
              [dataBindInfo.key]: { type: "array" },
            };

            node.properties.content = `$\${attributes.${dataBindInfo.key}}$$`;
            node.properties.onPickChange = `$\${${dataBindInfo.key} => setAttributes({ ${dataBindInfo.key} })}$$`;
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
