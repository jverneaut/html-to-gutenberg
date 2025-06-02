import ProcessorBase from "#processors/ProcessorBase.js";

import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { visit } from "unist-util-visit";
import { DATA_BIND_IMAGE_ELEMENTS } from "#constants";

export default class DataBindImage extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_IMAGE_ELEMENTS.includes(node.tagName)
        ) {
          this.blockData._hasAttributesProps = true;
          this.blockData._hasMediaUploadImport = true;

          this.blockData.attributes = {
            ...this.blockData.attributes,
            [node.properties.dataBind]: {
              type: "integer",
            },
          };

          node.tagName = "MediaUpload";

          node.properties.value = `$\${attributes.${node.properties.dataBind}}$$`;
          node.properties.onSelect = `$\${(image) => setAttributes({${node.properties.dataBind}: image.id})}$$`;

          node.properties.render = `$\${({open}) => <Image style={{ cursor: "pointer", pointerEvents: "all" }} onClick={open} ${node.properties.className ? `className="${node.properties.className.join(" ")}"` : ""} ${node.properties.width ? `width="${node.properties.width}"` : ""} ${node.properties.height ? `height="${node.properties.height}"` : ""} id={attributes.${node.properties.dataBind}} ${node.properties.dataImageSize ? `size="${node.properties.dataImageSize}"` : ""} onSelect={image => setAttributes({${node.properties.dataBind}: image.id})} />}$$`;

          delete node.children;
          delete node.properties.className;
          delete node.properties.dataBind;
          delete node.properties.dataImageSize;
        }
      });
    }

    if (filename === PrinterRenderPHP.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_IMAGE_ELEMENTS.includes(node.tagName)
        ) {
          const boundImage = { key: node.properties.dataBind };
          if (node.properties.dataImageSize) {
            boundImage.size = node.properties.dataImageSize;
          }

          this.blockData._boundImages.push(boundImage);

          node.properties.src = `<?php echo esc_url($${node.properties.dataBind}_src); ?>`;
          node.properties.srcset = `<?php echo esc_attr($${node.properties.dataBind}_srcset); ?>`;
          node.properties.sizes = `<?php echo esc_attr($${node.properties.dataBind}_sizes); ?>`;
          node.properties.alt = `<?php echo esc_attr($${node.properties.dataBind}_alt); ?>`;

          delete node.properties.dataAttribute;
          delete node.properties.dataImageSize;
        }
      });
    }
  }
}
