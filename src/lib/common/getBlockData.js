import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import { format } from "prettier";

import * as utils from "./utils.js";

import generateAst from "./generateAst.js";

const getBlockData = async (
  HTMLFileContent,
  { blockName, blockSlug, blockTitle, blockEngine },
) => {
  const ast = generateAst(HTMLFileContent);

  const blockData = {
    name: blockName,
    slug: blockSlug,
    title: blockTitle,
    description: null,
    engine: blockEngine,
    rootElement: {
      className: "",
      styles: [],
      parent: false,
      editingMode: null,
    },
    attributes: {},
    innerBlocks: {
      hasInnerBlocks: false,
      allowedBlocks: false,
      template: false,
      templateLock: null,
      orientation: false,
    },
    html: "",
    hasContent: false,
  };

  // Extract root element data and set root-placeholder
  visit(ast, "root", (node) => {
    const childrenElements = node.children.filter(
      (el) => el.type === "element",
    );

    if (childrenElements.length) {
      blockData.hasContent = true;

      const children = childrenElements[0];

      // Set root-placeholder
      children.properties["root-placeholder"] = true;

      // Extract and delete block name
      if (children.properties.dataName) {
        const blockName = children.properties.dataName.trim();
        blockData.name = blockName;

        // Validate and override blockSlug from blockName if set
        const blockSlug = blockName.split("/");
        if (blockSlug.length === 2 && blockSlug[1].length) {
          blockData.slug = blockSlug[1];
        }

        delete children.properties.dataName;
      }

      // Extract and delete block title
      if (children.properties.dataTitle) {
        blockData.title = children.properties.dataTitle.trim();

        delete children.properties.dataTitle;
      }

      // Extract and delete block description
      if (children.properties.dataDescription) {
        blockData.description = children.properties.dataDescription.trim();

        delete children.properties.dataDescription;
      }

      // Extract and delete class attribute
      if (children.properties.className) {
        blockData.rootElement.className =
          children.properties.className.join(" ");

        delete children.properties.className;
      }

      // Extract and delete data-styles attribute
      if (children.properties.dataStyles) {
        blockData.rootElement.styles = utils.spaceSeparatedStringToArray(
          children.properties.dataStyles,
        );

        delete children.properties.dataStyles;
      }

      // Extract and delete data-parent attribute
      if (children.properties.dataParent) {
        blockData.rootElement.parent = utils.spaceSeparatedStringToArray(
          children.properties.dataParent,
        );

        delete children.properties.dataParent;
      }

      // Extract and delete data-editing-mode attribute
      if (children.properties.dataEditingMode) {
        blockData.rootElement.editingMode = children.properties.dataEditingMode;

        delete children.properties.dataEditingMode;
      }
    }
  });

  // Extract attributes
  visit(ast, "element", (node) => {
    if (node.properties.dataAttribute) {
      if (node.tagName === "img") {
        blockData.attributes[node.properties.dataAttribute] = {
          type: "integer",
          _internalImageSize: node.properties.dataImageSize
            ? node.properties.dataImageSize
            : null,
          _internalType: "image",
        };
      } else {
        blockData.attributes[node.properties.dataAttribute] = {
          type: "string",
          _internalType: "text",
        };
      }

      if (node.children.length) {
        blockData.attributes[node.properties.dataAttribute].default = toHtml(
          node.children,
        )
          .trim()
          .split("\n")
          .map((line) => line.trim())
          .join(" ");
      }
    }
  });

  // Extract InnerBlocks data
  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      blockData.innerBlocks.hasInnerBlocks = true;

      const allowedBlocks = new Set();

      // If allowed blocks are explicitly set, define them
      if (node.properties.allowedBlocks !== undefined) {
        utils
          .spaceSeparatedStringToArray(node.properties.allowedBlocks)
          .forEach((allowedBlock) => {
            allowedBlocks.add(allowedBlock);
          });
      }

      // Retrieve child <block> elements
      const templateBlocks = node.children.filter(
        (el) => el.tagName === "block",
      );

      // Set allowed blocks to template blocks by default
      if (templateBlocks.length) {
        if (node.properties.allowedBlocks === undefined) {
          templateBlocks.forEach((templateBlock) => {
            allowedBlocks.add(templateBlock.properties.name);
          });
        }
      }

      if (allowedBlocks.size) {
        const allowedBlocksArray = [...allowedBlocks];

        if (allowedBlocksArray.join("") !== "") {
          blockData.innerBlocks.allowedBlocks = [...allowedBlocks];
        }
      }

      const template = [];

      if (templateBlocks.length) {
        templateBlocks.forEach((templateBlock) => {
          const blockTemplate = [templateBlock.properties.name];
          let blockTemplateAttributes = {};

          const blockAttributes = Object.keys(templateBlock.properties).filter(
            (propertyKey) => propertyKey !== "name",
          );

          // Retrieve attributes values set as <block key="value">
          if (blockAttributes.length) {
            const attributesData = blockAttributes.reduce(
              (acc, attributeKey) => {
                let attributeValue = null;

                if (templateBlock.properties[attributeKey]) {
                  attributeValue = utils.parseRawValue(
                    templateBlock.properties[attributeKey],
                  );
                }

                return {
                  ...acc,
                  [attributeKey]: attributeValue,
                };
              },
              {},
            );

            if (Object.keys(attributesData).length) {
              blockTemplateAttributes = {
                ...blockTemplateAttributes,
                ...attributesData,
              };
            }
          }

          const attributesElements = templateBlock.children.filter(
            (node) =>
              node.tagName === "attribute" &&
              Object.keys(node.properties).length,
          );

          if (attributesElements.length) {
            const attributesData = attributesElements.reduce(
              (acc, attributeElement) => {
                let attributeValue = null;

                // Retrieve attributes values set as <attribute name="key" value="value">
                if (attributeElement.properties.value) {
                  const rawValue = attributeElement.properties.value.trim();

                  if (rawValue) {
                    attributeValue = utils.parseRawValue(rawValue);
                  }
                }

                // Retrieve attributes values set as <attribute name="key">value</attribute>
                if (attributeElement.children.length) {
                  const rawValue = toHtml(attributeElement.children).trim();

                  if (rawValue) {
                    attributeValue = utils.parseRawValue(rawValue);
                  }
                }

                return {
                  ...acc,
                  [attributeElement.properties.name]: attributeValue,
                };
              },
              {},
            );

            if (Object.keys(attributesData).length) {
              blockTemplateAttributes = {
                ...blockTemplateAttributes,
                ...attributesData,
              };
            }
          }

          if (Object.keys(blockTemplateAttributes).length) {
            blockTemplate.push(blockTemplateAttributes);
          }

          template.push(blockTemplate);
        });
      }

      if (node.properties.templateLock !== undefined) {
        switch (node.properties.templateLock) {
          case "false":
            blockData.innerBlocks.templateLock = false;
            break;

          case "insert":
            blockData.innerBlocks.templateLock = "insert";
            break;

          case "contentOnly":
            blockData.innerBlocks.templateLock = "contentOnly";
            break;

          case "all":
            blockData.innerBlocks.templateLock = "all";
            break;

          case "":
          case "true":
          default:
            blockData.innerBlocks.templateLock = true;
            break;
        }
      }

      if (
        node.properties.orientation !== undefined &&
        ["horizontal", "vertical"].includes(node.properties.orientation)
      ) {
        blockData.innerBlocks.orientation = node.properties.orientation;
      }

      if (template.length) {
        blockData.innerBlocks.template = template;
      }
    }
  });

  // Convert AST back to HTML
  const html = await format(toHtml(ast), { parser: "html" });
  blockData.html = html;

  return blockData;
};

export default getBlockData;
