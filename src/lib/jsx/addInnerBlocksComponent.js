import { visit } from "unist-util-visit";

const addInnerBlocksComponent = (ast, innerBlocks) => {
  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      node.tagName = "InnerBlocks";
      node.properties = {};

      delete node.children;

      if (innerBlocks.allowedBlocks) {
        // If allowedBlocks is set to all, all blocks can be added, so we remove the property
        if (
          innerBlocks.allowedBlocks.length === 1 &&
          innerBlocks.allowedBlocks[0] === "all"
        ) {
          delete node.properties.allowedBlocks;
        } else {
          node.properties.allowedBlocks = `{${JSON.stringify(innerBlocks.allowedBlocks)}}`;
        }
      }

      if (innerBlocks.template) {
        node.properties.template = `{${JSON.stringify(innerBlocks.template)}}`;
      }

      if (innerBlocks.templateLock !== null) {
        if (!innerBlocks.templateLock) {
          node.properties.templateLock = `{false}`;
        } else {
          node.properties.templateLock = innerBlocks.templateLock;
        }
      }

      if (innerBlocks.orientation) {
        node.properties.orientation = innerBlocks.orientation;
      }
    }
  });
};

export default addInnerBlocksComponent;
