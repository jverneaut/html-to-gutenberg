import { visit } from "unist-util-visit";
import parseTemplateBlock from "../common/parseTemplateBlock.js";

const addServerSideRenderComponent = (ast) => {
  visit(ast, "element", (node) => {
    if (node.tagName === "server-block") {
      const parsedTemplateBlock = parseTemplateBlock(node, false);

      node.tagName = "ServerSideRender";
      node.properties = {
        block: parsedTemplateBlock[0],
        attributes: `{${JSON.stringify(parsedTemplateBlock[1])}}`,
      };

      delete node.children;
    }
  });
};

export default addServerSideRenderComponent;
