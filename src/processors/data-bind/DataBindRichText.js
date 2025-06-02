import ProcessorBase from "#processors/ProcessorBase.js";

import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { visit } from "unist-util-visit";

import { toSentenceCase } from "#utils-string/index.js";
import { getAttributeDeclaration } from "#utils-html/index.js";

import { DATA_BIND_NON_RICH_TEXT_ELEMENTS } from "#constants";

export default class DataBindRichText extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (
          node.properties.dataBind &&
          !DATA_BIND_NON_RICH_TEXT_ELEMENTS.includes(node.tagName)
        ) {
          this.blockData._hasAttributesProps = true;
          this.blockData._hasRichTextImport = true;

          this.blockData.attributes = {
            ...this.blockData.attributes,
            [node.properties.dataBind]: getAttributeDeclaration(node, "string"),
          };

          const initialTagName = node.tagName;
          node.tagName = "RichText";

          node.properties.tagName = initialTagName;
          node.properties.value = `$\${attributes.${node.properties.dataBind}}$$`;
          node.properties.onChange = `$\${${node.properties.dataBind} => setAttributes({ ${node.properties.dataBind} })}$$`;
          node.properties.placeholder = toSentenceCase(
            node.properties.dataBind,
          );

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
          node.children = [
            {
              type: "text",
              value: `<?php echo wp_kses_post($attributes['${node.properties.dataBind}'] ?? ''); ?>`,
            },
          ];

          delete node.properties.dataAttribute;
        }
      });
    }
  }
}
