import { toHtml } from "hast-util-to-html";

import { parseRawValue } from "#utils-string/index.js";

const parseNodeAttributes = (blockNode, recursive = true) => {
  const blockName = blockNode.properties.name;
  const blockTemplate = [blockName];

  let blockTemplateAttributes = {};

  const blockAttributes = Object.keys(blockNode.properties).filter(
    (propertyKey) => propertyKey !== "name",
  );

  // Retrieve attributes values set as <inner-block key="value">
  if (blockAttributes.length) {
    const attributesData = blockAttributes.reduce((acc, attributeKey) => {
      let attributeValue = null;

      if (blockNode.properties[attributeKey]) {
        attributeValue = parseRawValue(blockNode.properties[attributeKey]);
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

  // Parse nested <data-attribute> elements
  const attributesElements = blockNode.children.filter(
    (node) =>
      node.tagName === "block-attribute" && Object.keys(node.properties).length,
  );

  if (attributesElements.length) {
    const attributesData = attributesElements.reduce(
      (acc, attributeElement) => {
        let attributeValue = null;

        // Retrieve attributes values set as <data-attribute name="key" value="value">
        if (attributeElement.properties.value) {
          const rawValue = attributeElement.properties.value.trim();
          if (rawValue) {
            attributeValue = parseRawValue(rawValue);
          }
        }

        // Retrieve attributes values set as <data-attribute name="key">value</data-attribute>
        if (attributeElement.children.length) {
          const rawValue = toHtml(attributeElement.children).trim();
          if (rawValue) {
            attributeValue = parseRawValue(rawValue);
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
      (child) => child.tagName === "inner-block",
    );

    if (innerBlockNodes.length) {
      const innerBlocks = innerBlockNodes.map((innerBlockNode) =>
        parseNodeAttributes(innerBlockNode),
      );
      blockTemplate.push(innerBlocks);
    }
  }

  return blockTemplate;
};

export default parseNodeAttributes;
