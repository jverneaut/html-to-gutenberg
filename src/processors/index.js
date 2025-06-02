import RootAttributes from "./root/RootAttributes/index.js";
import RootBlockWrapperAttributes from "./root/RootBlockWrapperAttributes.js";
import RootUseBlockProps from "./root/RootUseBlockProps.js";
import RootBlockAttributeElement from "./root/RootBlockAttributeElement.js";

// Ordering matters has some processors rely on the mutable block data
export default [
  RootAttributes,
  RootBlockWrapperAttributes,
  RootUseBlockProps,
  RootBlockAttributeElement,
];
