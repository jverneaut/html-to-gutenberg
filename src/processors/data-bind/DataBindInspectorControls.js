import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";

import { deleteAttribute, getAttributeDeclaration } from "#utils-html/index.js";
import { DATA_BIND_CONTROLS_ELEMENTS } from "../../constants.js";

export default class DataBindInspectorControls extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_CONTROLS_ELEMENTS.includes(node.tagName)
        ) {
          this.blockData._hasAttributesProps = true;

          switch (node.tagName) {
            case "checkbox-control":
            case "toggle-control":
              this.blockData.attributes = {
                ...this.blockData.attributes,
                [node.properties.dataBind]: getAttributeDeclaration(
                  node,
                  "boolean",
                ),
              };

              node.properties.checked = `$\${attributes.${node.properties.dataBind}}$$`;
              node.properties.onChange = `$\${(${node.properties.dataBind}) => setAttributes({ ${node.properties.dataBind} })}$$`;

              break;

            case "radio-control":
              this.blockData.attributes = {
                ...this.blockData.attributes,
                [node.properties.dataBind]: getAttributeDeclaration(
                  node,
                  "string",
                ),
              };

              node.properties.selected = `$\${attributes.${node.properties.dataBind}}$$`;
              node.properties.onChange = `$\${(${node.properties.dataBind}) => setAttributes({ ${node.properties.dataBind} })}$$`;

              break;

            default:
              this.blockData.attributes = {
                ...this.blockData.attributes,
                [node.properties.dataBind]: getAttributeDeclaration(
                  node,
                  "string",
                ),
              };

              node.properties.value = `$\${attributes.${node.properties.dataBind}}$$`;
              node.properties.onChange = `$\${(${node.properties.dataBind}) => setAttributes({ ${node.properties.dataBind} })}$$`;

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
