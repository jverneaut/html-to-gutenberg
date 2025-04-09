import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";

const addInnerBlocksComponent = (ast, innerBlocks) => {
  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      node.tagName = "InnerBlocks";
      node.properties = {};

      delete node.children;

      if (innerBlocks.allowedBlocks) {
        node.properties.allowedBlocks = `{${JSON.stringify(innerBlocks.allowedBlocks)}}`;
      }

      if (innerBlocks.template) {
        node.properties.template = `{${JSON.stringify(innerBlocks.template)}}`;
      }

      if (innerBlocks.templateLock) {
        node.properties.templateLock = true;
      }

      if (innerBlocks.orientation) {
        node.properties.orientation = innerBlocks.orientation;
      }
    }
  });
};

export default addInnerBlocksComponent;
