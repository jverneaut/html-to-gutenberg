import ProcessorBase from "#processors/ProcessorBase.js";

import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { getDataBindInfo } from "#utils-string/index.js";
import { visit } from "unist-util-visit";
import { DATA_BIND_IMAGE_ELEMENTS, DATA_BIND_TYPES } from "#constants";

export default class DataBindImage extends ProcessorBase {
  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (
          node.properties.dataBind &&
          DATA_BIND_IMAGE_ELEMENTS.includes(node.tagName)
        ) {
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);

          this.blockData._hasMediaUploadImport = true;
          node.tagName = "MediaUpload";

          const generateRender = (getter, setter) => {
            const hasSrc =
              node.properties?.src && node.properties.src.trim() !== "";

            const imageComponent = `<Image style={{ cursor: "pointer", pointerEvents: "all" }} onClick={open} ${node.properties.className ? `className="${node.properties.className.join(" ")}"` : ""} ${node.properties.width ? `width="${node.properties.width}"` : ""} ${node.properties.height ? `height="${node.properties.height}"` : ""} id={${getter}} ${node.properties.dataImageSize ? `size="${node.properties.dataImageSize}"` : ""} onSelect={${setter}} />`;
            const originalImage = `<img src="${node.properties.src}" style={{ cursor: "pointer", pointerEvents: "all" }} onClick={open} ${node.properties.className ? `className="${node.properties.className.join(" ")}"` : ""} ${node.properties.width ? `width="${node.properties.width}"` : ""} ${node.properties.height ? `height="${node.properties.height}"` : ""} />`;
            if (hasSrc) {
              return `$\${({ open }) => ${getter} ? (${imageComponent}) : (${originalImage})}$$`;
            }

            return `$\${({ open }) => ${imageComponent}}$$`;
          };

          if (dataBindInfo.type === DATA_BIND_TYPES.attributes) {
            this.blockData._hasAttributesProps = true;

            this.blockData.attributes = {
              ...this.blockData.attributes,
              [dataBindInfo.key]: { type: "integer" },
            };

            node.properties.value = `$\${attributes.${dataBindInfo.key}}$$`;
            node.properties.onSelect = `$\${(image) => setAttributes({${dataBindInfo.key}: image.id})}$$`;

            node.properties.render = generateRender(
              `attributes.${dataBindInfo.key}`,
              `image => setAttributes({${dataBindInfo.key}: image.id})`,
            );
          }

          if (dataBindInfo.type === DATA_BIND_TYPES.postMeta) {
            this.blockData._hasPostType = true;
            this.blockData._hasPostMeta = true;

            node.properties.value = `$\${meta.${dataBindInfo.key}}$$`;
            node.properties.onSelect = `$\${(image) => setMeta({ ...meta, ${dataBindInfo.key}: image.id })}$$`;

            node.properties.render = generateRender(
              `meta.${dataBindInfo.key}`,
              `image => setMeta({ ...meta, ${dataBindInfo.key}: image.id})`,
            );
          }

          delete node.children;
          delete node.properties.src;
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
          const dataBindInfo = getDataBindInfo(node.properties.dataBind);
          if (node.properties.dataImageSize) {
            dataBindInfo.size = node.properties.dataImageSize;
          }

          this.blockData._boundImages.push(dataBindInfo);

          const hasSrc =
            node.properties?.src && node.properties.src.trim() !== "";

          node.properties.src = `<?php echo${hasSrc ? ` empty($${dataBindInfo.key}_src) ? ${hasSrc ? `'${node.properties.src}'` : "''"} :` : ""} esc_url($${dataBindInfo.key}_src); ?>`;
          node.properties.srcset = `<?php echo esc_attr($${dataBindInfo.key}_srcset); ?>`;
          node.properties.sizes = `<?php echo esc_attr($${dataBindInfo.key}_sizes); ?>`;
          node.properties.alt = `<?php echo esc_attr($${dataBindInfo.key}_alt); ?>`;

          delete node.properties.dataBind;
          delete node.properties.dataImageSize;
        }
      });
    }
  }
}
