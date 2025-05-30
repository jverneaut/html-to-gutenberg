import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import { format } from "prettier";
import parserHTML from "prettier/parser-html";

import * as utils from "./utils.js";

import generateAst from "./generateAst.js";
import parseTemplateBlock from "./parseTemplateBlock.js";

const collectAllowedBlocksRecursively = (node, allowedBlocksSet) => {
  if (node.tagName === "block" && node.properties.name) {
    allowedBlocksSet.add(node.properties.name);
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => {
      collectAllowedBlocksRecursively(child, allowedBlocksSet);
    });
  }
};

const getBlockData = async (
  HTMLFileContent,
  {
    blockName,
    blockSlug,
    blockTitle,

    defaultCategory,
    defaultIcon,
    defaultVersion,
  },
) => {
  const ast = generateAst(HTMLFileContent);

  const blockData = {
    name: blockName,
    slug: blockSlug,
    title: blockTitle,
    category: defaultCategory,
    icon: defaultIcon,
    version: defaultVersion,
    description: null,
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
    hasServerSideRender: false,
    hasIsSelected: false,
    html: "",
    hasContent: false,

    style: false,
    editorStyle: false,
    viewScript: false,
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

      // Extract and delete data-category attribute
      if (children.properties.dataCategory) {
        blockData.category = children.properties.dataCategory;

        delete children.properties.dataCategory;
      }

      // Extract and delete data-icon attribute
      if (children.properties.dataIcon) {
        blockData.icon = children.properties.dataIcon;

        delete children.properties.dataIcon;
      }

      // Extract and delete data-version attribute
      if (children.properties.dataVersion) {
        blockData.version = children.properties.dataVersion;

        delete children.properties.dataVersion;
      }

      // Extract and delete data-style attribute
      if (children.properties.dataStyle) {
        blockData.style = children.properties.dataStyle;

        delete children.properties.dataStyle;
      }

      // Extract and delete data-editor-style attribute
      if (children.properties.dataEditorStyle) {
        blockData.editorStyle = children.properties.dataEditorStyle;

        delete children.properties.dataEditorStyle;
      }

      // Extract and delete data-view-script attribute
      if (children.properties.dataViewScript) {
        blockData.viewScript = children.properties.dataViewScript;

        delete children.properties.dataViewScript;
      }
    }
  });

  // Extract attributes from data-attributes
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

  // Extract attributes from <block-attribute> elements
  visit(ast, "element", (node) => {
    if (node.tagName === "block-attribute") {
      if (node.properties.name) {
        blockData.attributes[node.properties.name] = {};

        const defaultValue =
          node.properties.default !== undefined
            ? utils.parseRawValue(node.properties.default)
            : undefined;

        if (defaultValue !== undefined) {
          blockData.attributes[node.properties.name].default = defaultValue;
        }

        if (node.properties.type !== undefined) {
          Object.assign(blockData.attributes[node.properties.name], {
            type: node.properties.type,
            _internalType: "text",
          });
        } else {
          if (node.properties.default !== undefined) {
            switch (typeof defaultValue) {
              case "number":
                if (Number.isInteger(defaultValue)) {
                  Object.assign(blockData.attributes[node.properties.name], {
                    type: "integer",
                    _internalType: "text",
                  });
                } else {
                  Object.assign(blockData.attributes[node.properties.name], {
                    type: "number",
                    _internalType: "text",
                  });
                }

                break;

              case "boolean":
                Object.assign(blockData.attributes[node.properties.name], {
                  type: "boolean",
                });

                delete blockData.attributes[node.properties.name]._internalType;

                break;

              default:
              case "string":
                Object.assign(blockData.attributes[node.properties.name], {
                  type: "string",
                  _internalType: "text",
                });

                break;
            }
          } else {
            Object.assign(blockData.attributes[node.properties.name], {
              type: "string",
              _internalType: "text",
            });
          }
        }
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
            collectAllowedBlocksRecursively(templateBlock, allowedBlocks);
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
          const parsedBlock = parseTemplateBlock(templateBlock);

          template.push(parsedBlock);
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

  // Set hasServerSideRender
  visit(ast, "element", (node) => {
    if (node.tagName === "server-block") {
      blockData.hasServerSideRender = true;
    }
  });

  // Set usesIsSelected
  visit(ast, "element", (node) => {
    if (
      node.properties.dataDisplay &&
      ["selected", "not-selected"].includes(node.properties.dataDisplay)
    ) {
      blockData.hasIsSelected = true;
    }
  });

  // Convert AST back to HTML
  const html = await format(toHtml(ast), {
    parser: "html",
    plugins: [parserHTML],
  });
  blockData.html = html;

  return blockData;
};

export default getBlockData;
