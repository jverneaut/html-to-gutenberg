import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";

const addInnerBlocksComponent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      node.tagName = "InnerBlocks";

      const allowedBlocks = new Set();

      if (node.properties.allowedBlocks !== undefined) {
        node.properties.allowedBlocks
          .split(" ")
          .forEach((block) => allowedBlocks.add(block.trim()));
      }

      const childBlocks = node.children.filter((el) => el.tagName === "block");
      if (childBlocks.length) {
        if (
          node.properties.allowedBlocks === undefined &&
          !node.properties.allowedBlocks
        ) {
          childBlocks.forEach((childBlock) =>
            allowedBlocks.add(childBlock.properties.name),
          );
        }
      }

      if (allowedBlocks.size) {
        node.properties.allowedBlocks = `{${JSON.stringify([...allowedBlocks])}}`;
      }

      if (childBlocks.length) {
        node.properties.template = `{${JSON.stringify(
          childBlocks.map((childBlock) => {
            const blockTemplate = [childBlock.properties.name];

            let blockTemplateAttributes = {};

            const attributesProps = Object.keys(childBlock.properties).filter(
              (key) => key !== "name",
            );

            if (attributesProps.length) {
              const attributesData = attributesProps.reduce((acc, curr) => {
                let value = null;

                if (childBlock.properties[curr]) {
                  const rawValue = childBlock.properties[curr];
                  try {
                    value = JSON.parse(rawValue);
                  } catch {
                    value = rawValue;
                  }
                }

                return {
                  ...acc,
                  [curr]: value,
                };
              }, {});

              if (Object.keys(attributesData).length) {
                blockTemplateAttributes = {
                  ...blockTemplateAttributes,
                  ...attributesData,
                };
              }
            }

            const attributesElements = childBlock.children.filter(
              (node) => node.tagName === "attribute",
            );

            if (attributesElements.length) {
              const attributesData = attributesElements.reduce((acc, curr) => {
                let value = null;

                if (curr.properties.value) {
                  const rawValue = curr.properties.value.trim();

                  if (rawValue) {
                    try {
                      value = JSON.parse(rawValue);
                    } catch {
                      value = rawValue;
                    }
                  }
                }

                if (curr.children.length) {
                  const htmlValue = toHtml(curr.children).trim();

                  if (htmlValue) {
                    try {
                      value = JSON.parse(htmlValue);
                    } catch {
                      value = htmlValue;
                    }
                  }
                }

                return {
                  ...acc,
                  [curr.properties.name]: value,
                };
              }, {});

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

            return blockTemplate;
          }),
        )}}`;
      }

      if (node.properties.templateLock !== undefined) {
        node.properties.templateLock = true;
      }

      delete node.children;
    }
  });
};

export default addInnerBlocksComponent;
