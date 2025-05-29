import * as utils from "./utils.js";
import { toHtml } from "hast-util-to-html";

const parseTemplateBlock = (blockNode, recursive = true) => {
  const blockName = blockNode.properties.name;
  const blockTemplate = [blockName];

  let blockTemplateAttributes = {};

  const blockAttributes = Object.keys(blockNode.properties).filter(
    (propertyKey) => propertyKey !== "name",
  );

  // Retrieve attributes values set as <block key="value">
  if (blockAttributes.length) {
    const attributesData = blockAttributes.reduce((acc, attributeKey) => {
      let attributeValue = null;

      if (blockNode.properties[attributeKey]) {
        attributeValue = utils.parseRawValue(
          blockNode.properties[attributeKey],
        );
      }

      return { ...acc, [attributeKey]: attributeValue };
    }, {});

    if (Object.keys(attributesData).length) {
      blockTemplateAttributes = {
        ...blockTemplateAttributes,
        ...attributesData,
      };
    }
  }

  // Parse nested <attribute> elements
  const attributesElements = blockNode.children.filter(
    (node) =>
      node.tagName === "attribute" && Object.keys(node.properties).length,
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

  blockTemplate.push(blockTemplateAttributes);

  if (recursive) {
    // Parse nested blocks recursively
    const innerBlockNodes = blockNode.children.filter(
      (child) => child.tagName === "block",
    );

    if (innerBlockNodes.length) {
      const innerBlocks = innerBlockNodes.map((innerBlockNode) =>
        parseTemplateBlock(innerBlockNode),
      );
      blockTemplate.push(innerBlocks);
    }
  }

  return blockTemplate;
};

export default parseTemplateBlock;
