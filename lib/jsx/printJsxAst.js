import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { format } from "prettier";
import Mustache from "mustache";

const template = fs.readFileSync(
  path.join(__dirname, "../../templates/edit.js.mustache"),
  "utf-8",
);

const stripQuotesAroundJSXExpressions = (html) =>
  html.replace(/(\w+)="\{(.*?)\}"/g, "$1={$2}");

const stripPropsTag = (html) => html.replaceAll("props=", "");

const replaceEscapedChars = (html) =>
  html.replaceAll("&#x22;", "'").replaceAll("&#x27;", "'");

const convertAttributesToCamelCase = (html, { attributes }) => {
  const kebabCaseToCamelCase = (s) =>
    s.replace(/-./g, (x) => x[1].toUpperCase());

  const camelCaseToKebabCase = (s) =>
    s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  return attributes.reduce((acc, curr) => {
    return acc
      .replaceAll(curr.toLowerCase() + "=", kebabCaseToCamelCase(curr) + "=")
      .replaceAll(
        camelCaseToKebabCase(curr) + "=",
        kebabCaseToCamelCase(curr) + "=",
      );
  }, html);
};

const convertClassToClassName = (html) =>
  html.replaceAll("class=", "className=");

const printJsxAst = async (ast) => {
  const attributes = new Set();

  const options = {
    hasAttributes: false,
    hasMedia: false,
    hasRichText: false,
    hasContent: false,
  };

  visit(ast, "element", (node) => {
    Object.keys(node.properties).forEach((propertyName) => {
      attributes.add(propertyName);
    });

    if (node.type === "element") {
      options.hasContent = true;
    }

    if (node.tagName === "RichText") {
      options.hasAttributes = true;
      options.hasRichText = true;
    }

    if (node.tagName === "MediaUpload") {
      options.hasAttributes = true;
      options.hasMedia = true;
    }
  });

  const html = [
    stripQuotesAroundJSXExpressions,
    stripPropsTag,
    replaceEscapedChars,
    convertAttributesToCamelCase,
    convertClassToClassName,
  ].reduce(
    (acc, curr) =>
      curr(acc, {
        attributes: [...attributes.values()],
      }),
    toHtml(ast, { closeSelfClosing: true }),
  );

  const renderedTemplate = Mustache.render(template, {
    content: html,
    ...options,
  });

  const formattedTemplate = await format(renderedTemplate, { parser: "babel" });
  return formattedTemplate;
};

export default printJsxAst;
