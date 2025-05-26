import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
import { format } from "prettier";
import parserBabel from "prettier/parser-babel";
import pluginESTree from "prettier/plugins/estree.js";
import Mustache from "mustache";

import generateAst from "./common/generateAst.js";
import * as utils from "./common/utils.js";

// AST Transformers
import addRichTextComponent from "./jsx/addRichTextComponent.js";
import addMediaUploadComponent from "./jsx/addMediaUploadComponent.js";
import addInnerBlocksComponent from "./jsx/addInnerBlocksComponent.js";
import convertStyleToObject from "./jsx/convertStyleToObject.js";

const template = `{{#hasContent}}
import {
useBlockProps,
{{#hasEditingMode}}
useBlockEditingMode,
{{/hasEditingMode}}
{{#hasInnerBlocks}}
InnerBlocks,
{{/hasInnerBlocks}}
{{#hasRichText}}
RichText,
{{/hasRichText}}
{{#hasMedia}}
MediaUpload,
{{/hasMedia}}
} from '@wordpress/block-editor';
{{#hasMedia}}
import { Image } from "@10up/block-components";
{{/hasMedia}}
{{/hasContent}}

{{#hasContent}}
export default (
{{#hasAttributes}}
{ attributes, setAttributes }
{{/hasAttributes}}
) => {
{{{ beforeContent }}}

return ({{{ content }}})
};
{{/hasContent}}

{{^hasContent}}
export default () => null;
{{/hasContent}}
`;

// Transformers specific JSX output
const stripQuotesFromJSX = (html) =>
  html.replace(/(\w+)="\{(.*?)\}"/g, "$1={$2}");

const camelizeAttributes = (html, { attributes }) =>
  attributes.reduce((acc, attr) => {
    const kebab = attr.toLowerCase();
    const camel = utils.kebabCaseToCamelCase(attr);
    return acc
      .replaceAll(`${kebab}=`, `${camel}=`)
      .replaceAll(`${utils.camelCaseToKebabCase(attr)}=`, `${camel}=`);
  }, html);

const replaceClassWithClassName = (html) =>
  html.replaceAll("class=", "className=");

// Generates the root element props
const generateRootProps = (blockData) => {
  const { className } = blockData.rootElement;
  const blockProps = `{...useBlockProps(${
    className ? `{ className: "${className}" }` : ""
  })}`;

  return blockProps;
};

const printEditJS = async (blockData) => {
  const { attributes, html, hasContent, innerBlocks, rootElement } = blockData;

  const attributeValues = Object.values(attributes);
  const options = {
    hasAttributes: Object.keys(attributes).length > 0,
    hasMedia: attributeValues.some((attr) => attr._internalType === "image"),
    hasRichText: attributeValues.some((attr) => attr._internalType === "text"),
    hasContent,
    hasInnerBlocks: innerBlocks.hasInnerBlocks,
    hasEditingMode: rootElement.editingMode !== null,
  };

  // Preprocess AST, add <RichText /> components, <InnerBlocks />, etc.
  const ast = generateAst(html);
  const jsxProcessors = [
    addRichTextComponent,
    addMediaUploadComponent,
    addInnerBlocksComponent,
    convertStyleToObject,
  ];
  jsxProcessors.forEach((processor) => processor.call({}, ast, innerBlocks));

  const foundAttributes = new Set();

  // Clean up empty attributes, eg. data-test="" to data-test
  visit(ast, "element", (node) => {
    for (const key of Object.keys(node.properties)) {
      foundAttributes.add(key);
      if (
        node.properties[key] !== undefined &&
        node.properties[key].toString().trim() === ""
      ) {
        node.properties[key] = true;
      }
    }
  });

  // Step Convert AST back to HTML
  const rawHtml = toHtml(ast, { closeSelfClosing: true });
  const transformedHtml = [
    utils.replaceEscapedChars,
    stripQuotesFromJSX,
    camelizeAttributes,
    replaceClassWithClassName,
  ].reduce(
    (html, transformer) =>
      transformer(html, { attributes: [...foundAttributes] }),
    rawHtml,
  );

  // Set root attributes
  const content = transformedHtml.replace(
    "root-placeholder",
    generateRootProps(blockData),
  );

  // Add hooks calls
  const hooksCalls = [
    options.hasEditingMode
      ? `useBlockEditingMode("${rootElement.editingMode}")`
      : false,
  ]
    .filter(Boolean)
    .join("\n");

  const beforeContent = [hooksCalls].join("\n");

  // Render final JS file
  const rendered = Mustache.render(template, {
    beforeContent,
    content,
    ...options,
  });

  return format(rendered, {
    parser: "babel",
    plugins: [parserBabel, pluginESTree],
  });
};

export default printEditJS;
