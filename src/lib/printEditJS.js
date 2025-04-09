import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
import { format } from "prettier";
import Mustache from "mustache";

import generateAst from "./common/generateAst.js";
import * as utils from "./common/utils.js";

// AST Transformers
import addRichTextComponent from "./jsx/addRichTextComponent.js";
import addMediaUploadComponent from "./jsx/addMediaUploadComponent.js";
import addInnerBlocksComponent from "./jsx/addInnerBlocksComponent.js";
import convertStyleToObject from "./jsx/convertStyleToObject.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const template = fs.readFileSync(
  path.join(__dirname, "../templates/edit.js.mustache"),
  "utf-8",
);

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

// Generates the useBlockProps and useInnerBlocksProps lines
const generateDeclarations = (blockData) => {
  const { className } = blockData.rootElement;
  const blockProps = `const blockProps = useBlockProps(${
    className ? `{ className: "${className}" }` : ""
  });`;

  if (!blockData.innerBlocks.hasInnerBlocks) return blockProps;

  const { allowedBlocks, orientation, template, templateLock } =
    blockData.innerBlocks;

  const props = [
    allowedBlocks && `allowedBlocks: ${JSON.stringify(allowedBlocks)},`,
    orientation && `orientation: ${JSON.stringify(orientation)},`,
    template && `template: ${JSON.stringify(template)},`,
    templateLock && `templateLock: ${JSON.stringify(templateLock)},`,
  ]
    .filter(Boolean)
    .join("\n");

  const innerBlocks = [
    "const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps",
    props ? `, {\n${props}\n}` : "",
    ");",
  ].join("");

  return [blockProps, innerBlocks].join("\n\n");
};

const generateRootProps = ({ hasInnerBlocks }) =>
  ["{ ...blockProps }", hasInnerBlocks && "{ ...innerBlocksProps }"]
    .filter(Boolean)
    .join(" ");

const printEditJS = async (blockData) => {
  const { attributes, html, hasContent, innerBlocks, rootElement } = blockData;

  const attributeValues = Object.values(attributes);
  const options = {
    hasAttributes: Object.keys(attributes).length > 0,
    hasMedia: attributeValues.some((attr) => attr._internalType === "image"),
    hasRichText: attributeValues.some((attr) => attr._internalType === "text"),
    hasContent,
    hasInnerBlocks: innerBlocks.hasInnerBlocks,
  };

  // Preprocess AST, add <RichText /> components, <InnerBlocks />, etc.
  const ast = generateAst(html);
  const jsxProcessors = [
    addRichTextComponent,
    addMediaUploadComponent,
    addInnerBlocksComponent,
    convertStyleToObject,
  ];
  jsxProcessors.forEach((processor) => processor.call({}, ast));

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
    generateRootProps(options),
  );

  // Render final JS file
  const rendered = Mustache.render(template, {
    content,
    beforeContent: generateDeclarations(blockData),
    ...options,
  });

  return format(rendered, { parser: "babel" });
};

export default printEditJS;
