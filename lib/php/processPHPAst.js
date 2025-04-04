import removeComments from "../common/removeComments.js";

import addTextLookup from "./addTextLookup.js";
import addImgLookup from "./addImgLookup.js";

import addWrapperAttributesToRootNode from "./addWrapperAttributesToRootNode.js";
import addInnerBlocksContent from "./addInnerBlocksContent.js";

import formatHTML from "./formatHTML.js";

const processPHPAst = async (ast) => {
  removeComments(ast);
  const formattedAST = await formatHTML(ast);

  addTextLookup(formattedAST);
  addImgLookup(formattedAST);

  addWrapperAttributesToRootNode(formattedAST);
  addInnerBlocksContent(formattedAST);

  return formattedAST;
};

export default processPHPAst;
