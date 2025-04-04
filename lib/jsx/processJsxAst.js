import preventNestedFields from "../common/preventNestedFields.js";
import preventSpecialCharacters from "../common/preventSpecialCharacters.js";
import ensureSingleRootElement from "../common/ensureSingleRootElement.js";
import removeComments from "../common/removeComments.js";
import preventDuplicateInnerBlocks from "../common/preventDuplicateInnerBlocks.js";
import preventTemplatedBlockNotInAllowedBlocks from "../common/preventTemplatedBlockNotInAllowedBlocks.js";

import addRichTextComponent from "./addRichTextComponent.js";
import addMediaUploadComponent from "./addMediaUploadComponent.js";
import addRootElementProps from "./addRootElementProps.js";
import addInnerBlocksComponent from "./addInnerBlocksComponent.js";
import convertStyleToObject from "./convertStyleToObject.js";

const processJsxAst = (ast) => {
  preventNestedFields(ast);
  preventSpecialCharacters(ast);
  ensureSingleRootElement(ast);
  removeComments(ast);
  preventDuplicateInnerBlocks(ast);
  preventTemplatedBlockNotInAllowedBlocks(ast);

  addRichTextComponent(ast);
  addMediaUploadComponent(ast);
  addRootElementProps(ast);
  addInnerBlocksComponent(ast);
  convertStyleToObject(ast);
};

export default processJsxAst;
