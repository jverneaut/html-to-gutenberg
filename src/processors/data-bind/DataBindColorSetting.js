import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { getDataBindInfo } from "#utils-string/index.js";
import { deleteAttribute, getAttributeDeclaration } from "#utils-html/index.js";
import {
  DATA_BIND_COLOR_SETTING_ELEMENT,
  DATA_BIND_TYPES,
} from "../../constants.js";

export default class DataBindColorSetting extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          node.tagName === DATA_BIND_COLOR_SETTING_ELEMENT
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData._hasAttributesProps = true;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            this.blockData._hasPostType = true;
            this.blockData._hasPostMeta = true;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData.attributes = {
              ...this.blockData.attributes,
              [dataBindInfo.key]: getAttributeDeclaration(node, "string"),
            };

            node.properties.value = `$\${attributes.${dataBindInfo.key}}$$`;
            node.properties.onChange = `$\${(${dataBindInfo.key}) => setAttributes({ ${dataBindInfo.key} })}$$`;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            node.properties.value = `$\${meta.${dataBindInfo.key}}$$`;
            node.properties.onChange = `$\${(${dataBindInfo.key}) => setMeta({ ...meta, ${dataBindInfo.key} })}$$`;
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
