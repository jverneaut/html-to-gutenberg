import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Mustache from "mustache";

import removeAttributeWrapper from "../common/removeAttributeWrapper.js";

const template = fs.readFileSync(
  path.join(__dirname, "../../templates/render.php.mustache"),
  "utf-8",
);

const stripWrapperAttributesTag = (html) =>
  html.replace(
    /wrapperAttributes="(\{\{\s*wrapper_attributes\((?:[^(){}]|\{[^{}]*\})*\)\s*\}\})"/g,
    "$1",
  );

const replaceEscapedChars = (html) =>
  html
    .replaceAll("&#x22;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#x3C;", "<");

const printPHPAst = async (ast, phpInitialAst) => {
  const images = [];

  const options = {
    hasImages: false,
    hasContent: false,
  };

  visit(phpInitialAst, "element", (node) => {
    if (node.properties.dataAttribute) {
      if (node.tagName === "img") {
        images.push(node.properties.dataAttribute);
        options.hasImages = true;
      }
    }
  });

  const html = [
    replaceEscapedChars,
    stripWrapperAttributesTag,
    (html) => removeAttributeWrapper(html, "wrapperAttributes"),
  ]
    .reduce((acc, curr) => curr(acc), toHtml(ast, { closeSelfClosing: true }))
    .trim();

  if (html.length) {
    options.hasContent = true;
  }

  const imagesDefinitions = images
    .map((image) =>
      [
        `$${image} = wp_get_attachment_image_src($attributes['${image}'], 'full');`,
        `$${image}_alt = get_post_meta($attributes['${image}'], '_wp_attachment_image_alt', true);`,
      ].join("\n"),
    )
    .join("\n\n");

  const renderedTemplate = Mustache.render(template, {
    content: html,
    imagesDefinitions,
    ...options,
  });

  return renderedTemplate;
};

export default printPHPAst;
