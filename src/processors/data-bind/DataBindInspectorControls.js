import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { getDataBindInfo } from "#utils-string/index.js";
import { deleteAttribute, getAttributeDeclaration } from "#utils-html/index.js";
import {
  DATA_BIND_CONTROLS_ELEMENTS,
  DATA_BIND_TYPES,
} from "../../constants.js";

export default class DataBindInspectorControls extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_CONTROLS_ELEMENTS.includes(node.tagName)
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData._hasAttributesProps = true;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            this.blockData._hasPostType = true;
            this.blockData._hasPostMeta = true;
          }

          switch (node.tagName) {
            case "checkbox-control":
            case "toggle-control":
              if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
                this.blockData.attributes = {
                  ...this.blockData.attributes,
                  [dataBindInfo.key]: getAttributeDeclaration(node, "boolean"),
                };

                node.properties.checked = `$\${attributes.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(${dataBindInfo.key}) => setAttributes({ ${dataBindInfo.key} })}$$`;
              }

              if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
                node.properties.checked = `$\${meta.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(${dataBindInfo.key}) => setMeta({ ...meta, ${dataBindInfo.key} })}$$`;
              }

              break;

            case "radio-control":
              if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
                this.blockData.attributes = {
                  ...this.blockData.attributes,
                  [dataBindInfo.key]: getAttributeDeclaration(node, "string"),
                };

                node.properties.selected = `$\${attributes.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(${dataBindInfo.key}) => setAttributes({ ${dataBindInfo.key} })}$$`;
              }

              if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
                node.properties.selected = `$\${meta.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(${dataBindInfo.key}) => setMeta({ ...meta, ${dataBindInfo.key} })}$$`;
              }

              break;

            default:
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
