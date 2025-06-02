import RootAttributes from "./root/RootAttributes/index.js";
import RootBlockWrapperAttributes from "./root/RootBlockWrapperAttributes.js";
import RootUseBlockProps from "./root/RootUseBlockProps.js";

import AttributeDataDisplay from "./attributes/AttributeDataDisplay.js";
import AttributeStyle from "./attributes/AttributeStyle.js";

import CustomElementInnerBlocks from "./custom-elements/CustomElementInnerBlocks.js";
import CustomElementInspectorControls from "./custom-elements/CustomElementInspectorControls/index.js";
import CustomElementRootBlockAttribute from "./custom-elements/CustomElementRootBlockAttribute.js";
import CustomElementServerBlock from "./custom-elements/CustomElementServerBlock.js";

import DataBind from "./data-bind/index.js";

import GlobalDepreciations from "./global/GlobalDepreciations.js";
import GlobalErrors from "./global/GlobalErrors.js";
import GlobalJSXAttributes from "./global/GlobalJSXAttributes.js";
import GlobalRawExpressions from "./global/GlobalRawExpressions.js";

// Ordering matters as some processors rely on the mutated block data later on
export default [
  GlobalDepreciations,
  GlobalErrors,

  RootAttributes,
  RootBlockWrapperAttributes,
  RootUseBlockProps,

  AttributeDataDisplay,
  AttributeStyle,

  DataBind,

  CustomElementInnerBlocks,
  CustomElementInspectorControls,
  CustomElementRootBlockAttribute,
  CustomElementServerBlock,

  GlobalJSXAttributes,
  GlobalRawExpressions,
];
