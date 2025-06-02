import ProcessorBase from "#processors/ProcessorBase.js";

import PrinterEditJS from "#printers/PrinterEditJS.js";
import PrinterRenderPHP from "#printers/PrinterRenderPHP.js";

import { visit } from "unist-util-visit";
import { parseNodeAttributes } from "#utils-html/index.js";

export default class CustomElementInnerBlocks extends ProcessorBase {
  collectAllowedBlocksRecursively(node, allowedBlocksSet) {
    if (node.tagName === "inner-block" && node.properties.name) {
      allowedBlocksSet.add(node.properties.name);
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        this.collectAllowedBlocksRecursively(child, allowedBlocksSet);
      });
    }
  }

  processAstByFilename(filename) {
    if (filename === PrinterEditJS.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (node.tagName === "inner-blocks") {
          this.blockData._hasInnerBlocks = true;

          const allowedBlocks = new Set();

          // If allowed blocks are explicitly set, define them
          if (node.properties.allowedBlocks !== undefined) {
            node.properties.allowedBlocks
              .split(" ")
              .filter((string) => string.trim() !== "")
              .forEach((allowedBlock) => {
                allowedBlocks.add(allowedBlock);
              });
          }

          // Retrieve child <block> elements
          const templateBlocks = node.children.filter(
            (el) => el.tagName === "inner-block",
          );

          // Set allowed blocks to template blocks by default
          if (templateBlocks.length) {
            if (node.properties.allowedBlocks === undefined) {
              templateBlocks.forEach((templateBlock) => {
                this.collectAllowedBlocksRecursively(
                  templateBlock,
                  allowedBlocks,
                );
              });
            }
          }

          let allowedBlocksProps = false;
          if (allowedBlocks.size) {
            const allowedBlocksArray = [...allowedBlocks];

            if (allowedBlocksArray.join("") !== "") {
              allowedBlocksProps = [...allowedBlocks];
            }
          }

          const template = [];

          if (templateBlocks.length) {
            templateBlocks.forEach((templateBlock) => {
              const parsedBlock = parseNodeAttributes(templateBlock);

              template.push(parsedBlock);
            });
          }

          let templateLock = null;

          if (node.properties.templateLock !== undefined) {
            switch (node.properties.templateLock) {
              case "false":
                templateLock = false;
                break;

              case "insert":
                templateLock = "insert";
                break;

              case "contentOnly":
                templateLock = "contentOnly";
                break;

              case "all":
                templateLock = "all";
                break;

              case "":
              case "true":
              default:
                templateLock = true;
                break;
            }
          }

          let orientation = false;

          if (
            node.properties.orientation !== undefined &&
            ["horizontal", "vertical"].includes(node.properties.orientation)
          ) {
            orientation = node.properties.orientation;
          }

          node.tagName = "InnerBlocks";
          node.properties = {};

          delete node.children;

          if (allowedBlocksProps.length) {
            // If allowedBlocks is set to all, all blocks can be added, so we remove the property
            if (
              allowedBlocksProps.length === 1 &&
              allowedBlocksProps[0] === "all"
            ) {
              delete node.properties.allowedBlocks;
            } else {
              node.properties.allowedBlocks = `$\${${JSON.stringify(allowedBlocksProps)}}$$`;
            }
          }

          if (template.length) {
            node.properties.template = `$\${${JSON.stringify(template)}}$$`;
          }

          if (templateLock !== null) {
            if (!templateLock) {
              node.properties.templateLock = `$\${false}$$`;
            } else {
              node.properties.templateLock = templateLock;
            }
          }

          if (orientation) {
            node.properties.orientation = orientation;
          }
        }
      });
    }

    if (filename === PrinterRenderPHP.filename) {
      visit(this.asts[filename], "element", (node) => {
        if (node.tagName === "inner-blocks") {
          node.type = "text";
          node.value = "<?php echo $content; ?>";
        }
      });
    }
  }
}
