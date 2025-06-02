import RootAttributes from "./root/RootAttributes/index.js";
import RootBlockWrapperAttributes from "./root/RootBlockWrapperAttributes.js";
import RootUseBlockProps from "./root/RootUseBlockProps.js";
import RootBlockAttributeElement from "./root/RootBlockAttributeElement.js";

import GlobalJSXAttributes from "./global/GlobalJSXAttributes.js";
import GlobalRawExpressions from "./global/GlobalRawExpressions.js";

// Ordering matters as some processors rely on the mutated block data later on
export default [
  RootAttributes,
  RootBlockWrapperAttributes,
  RootUseBlockProps,
  RootBlockAttributeElement,

  GlobalJSXAttributes,
  GlobalRawExpressions,
];
