import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import Mustache from "mustache";

import generateAst from "./common/generateAst.js";
import * as utils from "./common/utils.js";

// AST Transformers
import addInnerBlocksContent from "./php/addInnerBlocksContent.js";
import addImgLookup from "./php/addImgLookup.js";
import addTextLookup from "./php/addTextLookup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const template = fs.readFileSync(
  path.join(__dirname, "../templates/render.php.mustache"),
  "utf-8",
);

// Extract image attribute keys from blockData
const extractImageKeys = (attributes) =>
  Object.entries(attributes)
    .filter(([, attribute]) => attribute._internalType === "image")
    .map(([key]) => key);

// Generate PHP code to resolve images from image keys
const generateImageDefinitions = (imageKeys) =>
  imageKeys
    .map((key) => {
      return [
        `$${key}_id = $attributes['${key}'] ?? '';`,
        `$${key} = $${key}_id ? wp_get_attachment_image_src($${key}_id, 'full') : [''];`,
        `$${key}_url = $${key}[0] ?? '';`,
        `$${key}_alt = $${key}_id ? get_post_meta($${key}_id, '_wp_attachment_image_alt', true) : '';`,
      ].join("\n");
    })
    .join("\n\n");

// Normalize empty string attributes in AST
const normalizeAstAttributes = (ast) => {
  visit(ast, "element", (node) => {
    for (const [key, value] of Object.entries(node.properties)) {
      if (value !== undefined && value.toString().trim() === "") {
        node.properties[key] = true;
      }
    }
  });
};

const printRenderPHP = (blockData) => {
  const { attributes, html, hasContent, rootElement } = blockData;

  // Extract image data
  const imageKeys = extractImageKeys(attributes);
  const imagesDefinitions = generateImageDefinitions(imageKeys);

  // Generate and process AST
  const ast = generateAst(html);
  const processors = [
    normalizeAstAttributes,
    addInnerBlocksContent,
    addImgLookup,
    addTextLookup,
  ];

  processors.forEach((processor) => processor.call({}, ast));

  // Convert AST back to HTML
  const renderedHtml = toHtml(ast, { closeSelfClosing: true });
  const cleanedHtml = utils.replaceEscapedChars(renderedHtml);

  // Replace placeholder with PHP block wrapper attributes
  const wrapperAttributes = rootElement.className
    ? `['class' => '${rootElement.className}']`
    : "";

  const phpWrapper = `<?php echo get_block_wrapper_attributes(${wrapperAttributes}); ?>`;
  const content = cleanedHtml.replace("root-placeholder", phpWrapper);

  // Render PHP template
  const renderedTemplate = Mustache.render(template, {
    content,
    imagesDefinitions,
    hasImages: imageKeys.length > 0,
    hasContent,
  });

  // Ensure newline at EOF
  return renderedTemplate.length
    ? renderedTemplate.replace(/\s*$/, "\n")
    : renderedTemplate;
};

export default printRenderPHP;
