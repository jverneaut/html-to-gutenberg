import { visit } from "unist-util-visit";

import ProcessorBase from "#processors/ProcessorBase.js";
import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { getDataBindInfo } from "#utils-string/index.js";
import { deleteAttribute, getAttributeDeclaration } from "#utils-html/index.js";
import { DATA_BIND_INPUT_ELEMENTS, DATA_BIND_TYPES } from "#constants";

export default class DataBindInput extends ProcessorBase {
  processAstByFilename(printerFilename) {
    if (printerFilename === PrinterEditJS.filename) {
      visit(this.asts[printerFilename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_INPUT_ELEMENTS.includes(node.tagName)
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData._hasAttributesProps = true;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            this.blockData._hasPostType = true;
            this.blockData._hasPostMeta = true;
          }

          switch (node.properties.type) {
            case "checkbox":
              if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
                this.blockData.attributes = {
                  ...this.blockData.attributes,
                  [dataBindInfo.key]: getAttributeDeclaration(node, "boolean"),
                };

                node.properties.checked = `$\${attributes.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(e) => setAttributes({ ${dataBindInfo.key}: e.target.checked })}$$`;
              }

              if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
                node.properties.checked = `$\${meta.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(e) => setMeta({ ...meta, ${dataBindInfo.key}: e.target.checked })}$$`;
              }

              break;

            default:
              if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
                this.blockData.attributes = {
                  ...this.blockData.attributes,
                  [dataBindInfo.key]: getAttributeDeclaration(node, "string"),
                };

                node.properties.value = `$\${attributes.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(e) => setAttributes({ ${dataBindInfo.key}: e.target.value })}$$`;
              }

              if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
                node.properties.value = `$\${meta.${dataBindInfo.key}}$$`;
                node.properties.onChange = `$\${(e) => setMeta({ ...meta, ${dataBindInfo.key}: e.target.value })}$$`;
              }

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
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          switch (node.properties.type) {
            case "checkbox":
              if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
                node.properties.checked = `_$$<?= ($attributes['${dataBindInfo.key}'] ?? false) ? 'checked' : ''; ?>$$`;
              }

              if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
                node.properties.checked = `_$$<?= get_post_meta(get_the_ID(), '${dataBindInfo.key}', true) ? 'checked' : ''; ?>$$`;
              }

              break;

            default:
              if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
                node.properties.value = `<?= wp_kses_post($attributes['${node.properties.dataBind}'] ?? ''); ?>`;
              }

              if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
                node.properties.value = `<?= wp_kses_post(get_post_meta(get_the_ID(), '${dataBindInfo.key}', true)); ?>`;
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
