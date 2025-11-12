import RootAttributes from "./root/RootAttributes/index.js";
import RootBlockWrapperAttributes from "./root/RootBlockWrapperAttributes.js";
import RootUseBlockProps from "./root/RootUseBlockProps.js";
import RootInlineStyle from "./root/RootInlineStyle.js";

import AttributeDataDisplay from "./attributes/AttributeDataDisplay.js";
import AttributeIcon from "./attributes/AttributeIcon.js";
import AttributeStyle from "./attributes/AttributeStyle.js";

import CustomElementBlockControls from "./custom-elements/CustomElementBlockControls.js";
import CustomElementContentPicker from "./custom-elements/CustomElementContentPicker.js";
import CustomElementInnerBlocks from "./custom-elements/CustomElementInnerBlocks.js";
import CustomElementInspectorControls from "./custom-elements/CustomElementInspectorControls/index.js";
import CustomElementRootBlockAttribute from "./custom-elements/CustomElementRootBlockAttribute.js";
import CustomElementServerBlock from "./custom-elements/CustomElementServerBlock.js";
import CustomElementToolbar from "./custom-elements/CustomElementToolbar.js";
import CustomElementToolbarButton from "./custom-elements/CustomElementToolbarButton.js";
import CustomElementToolbarDropdownMenu from "./custom-elements/CustomElementToolbarDropdownMenu.js";
import CustomElementToolbarGroup from "./custom-elements/CustomElementToolbarGroup.js";
import CustomElementToolbarItem from "./custom-elements/CustomElementToolbarItem.js";

import DataBind from "./data-bind/index.js";

import GlobalAttributeExpression from "./global/GlobalAttributeExpression.js";
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
  RootInlineStyle,

  AttributeDataDisplay,
  AttributeStyle,

  DataBind,

  CustomElementBlockControls,
  CustomElementContentPicker,
  CustomElementInnerBlocks,
  CustomElementInspectorControls,
  CustomElementRootBlockAttribute,
  CustomElementServerBlock,
  CustomElementToolbar,
  CustomElementToolbarButton,
  CustomElementToolbarDropdownMenu,
  CustomElementToolbarGroup,
  CustomElementToolbarItem,

  AttributeIcon,

  GlobalAttributeExpression,
  GlobalJSXAttributes,
  GlobalRawExpressions,
];
