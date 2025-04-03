import preventNestedFields from "../common/preventNestedFields.js";
import preventSpecialCharacters from "../common/preventSpecialCharacters.js";
import ensureSingleRootElement from "../common/ensureSingleRootElement.js";
import removeComments from "../common/removeComments.js";

import addRichTextComponent from "./addRichTextComponent.js";
import addMediaUploadComponent from "./addMediaUploadComponent.js";
import addRootElementProps from "./addRootElementProps.js";

const processJsxAst = (ast) => {
  preventNestedFields(ast);
  preventSpecialCharacters(ast);
  ensureSingleRootElement(ast);
  removeComments(ast);

  addRichTextComponent(ast);
  addMediaUploadComponent(ast);
  addRootElementProps(ast);
};

export default processJsxAst;
