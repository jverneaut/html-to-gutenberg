import { toHtml } from "hast-util-to-html";
import { format } from "prettier";
import { visit } from "unist-util-visit";

import generateAst from "./common/generateAst.js";
import * as utils from "./common/utils.js";

// AST Transformers
import addImgLookup from "./twig/addImgLookup.js";
import addTextLookup from "./twig/addTextLookup.js";
import addInnerBlocksContent from "./twig/addInnerBlocksContent.js";

// Clean up empty attributes, eg. data-test="" to data-test
const cleanAttributes = (ast) => {
  visit(ast, "element", (node) => {
    Object.keys(node.properties).forEach((propertyKey) => {
      if (
        node.properties[propertyKey] !== undefined &&
        node.properties[propertyKey].toString().trim() === ""
      ) {
        node.properties[propertyKey] = true;
      }
    });
  });
};

const printRenderTwig = async (blockData) => {
  // Generate and process AST
  const ast = generateAst(blockData.html);
  const processors = [
    cleanAttributes,
    addInnerBlocksContent,
    addImgLookup,
    addTextLookup,
  ];

  processors.forEach((processor) => processor.call({}, ast));

  // Convert AST back to HTML
  const rawHtml = toHtml(ast, { closeSelfClosing: true });
  const processedHtml = [utils.replaceEscapedChars].reduce(
    (acc, curr) => curr(acc),
    rawHtml,
  );

  // Set root element wrapper attributes
  const rootAttributes = `{{ function('get_block_wrapper_attributes', ${
    blockData.rootElement.className
      ? `{ class: '${blockData.rootElement.className}' }`
      : ""
  }) }}`;

  const content = processedHtml.replace("root-placeholder", rootAttributes);

  const formatted = await format(content, {
    parser: "twig",
    plugins: ["@zackad/prettier-plugin-twig"],
  });

  return formatted;
};

export default printRenderTwig;
