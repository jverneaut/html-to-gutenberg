import ProcessorBase from "#processors/ProcessorBase.js";

import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { visit } from "unist-util-visit";

import { toSentenceCase, getDataBindInfo } from "#utils-string/index.js";
import { getAttributeDeclaration } from "#utils-html/index.js";

import { DATA_BIND_NON_RICH_TEXT_ELEMENTS, DATA_BIND_TYPES } from "#constants";

export default class DataBindRichText extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (
          node.properties.dataBind &&
          !DATA_BIND_NON_RICH_TEXT_ELEMENTS.includes(node.tagName)
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          this.blockData._hasRichTextImport = true;
          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData._hasAttributesProps = true;
            this.blockData.attributes = {
              ...this.blockData.attributes,
              [dataBindInfo.key]: getAttributeDeclaration(node, "string"),
            };
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            this.blockData._hasPostType = true;
            this.blockData._hasPostMeta = true;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postTitle) {
            this.blockData._hasPostType = true;
            this.blockData._hasPostTitle = true;
          }

          const initialTagName = node.tagName;
          node.tagName = "RichText";
          node.properties.tagName = initialTagName;

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            node.properties.value = `$\${attributes.${dataBindInfo.key}}$$`;
            node.properties.onChange = `$\${${dataBindInfo.key} => setAttributes({ ${dataBindInfo.key} })}$$`;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            node.properties.value = `$\${meta.${dataBindInfo.key}}$$`;
            node.properties.onChange = `$\${${dataBindInfo.key} => setMeta({ ...meta, ${dataBindInfo.key} })}$$`;
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postTitle) {
            node.properties.value = `$\${postTitle}$$`;
            node.properties.onChange = `$\${(postTitle) => setPostTitle(postTitle)}$$`;
          }

          if (dataBindInfo.key) {
            node.properties.placeholder = toSentenceCase(dataBindInfo.key);
          }

          delete node.children;
          delete node.properties.dataBind;
        }
      });
    }

    if (filename === PrinterRenderPHP.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (
          node.properties.dataBind &&
          !DATA_BIND_NON_RICH_TEXT_ELEMENTS.includes(node.tagName)
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            node.children = [
              {
                type: "text",
                value: `<?php echo wp_kses_post($attributes['${dataBindInfo.key}'] ?? ''); ?>`,
              },
            ];
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            node.children = [
              {
                type: "text",
                value: `<?php echo wp_kses_post(get_post_meta(get_the_ID(), '${dataBindInfo.key}', true)); ?>`,
              },
            ];
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postTitle) {
            node.children = [
              {
                type: "text",
                value: `<?php echo get_the_title(); ?>`,
              },
            ];
          }

          delete node.properties.dataAttribute;
        }
      });
    }
  }
}
