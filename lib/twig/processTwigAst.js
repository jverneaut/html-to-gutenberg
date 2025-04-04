import removeComments from "../common/removeComments.js";

import addTextLookup from "./addTextLookup.js";
import addImgLookup from "./addImgLookup.js";

import addWrapperAttributesToRootNode from "./addWrapperAttributesToRootNode.js";
import addInnerBlocksContent from "./addInnerBlocksContent.js";

const processTwigAst = (ast) => {
  removeComments(ast);

  addTextLookup(ast);
  addImgLookup(ast);

  addWrapperAttributesToRootNode(ast);
  addInnerBlocksContent(ast);
};

export default processTwigAst;
