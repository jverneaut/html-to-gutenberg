import { visit } from "unist-util-visit";

import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { format } from "prettier";
import Mustache from "mustache";

const template = fs.readFileSync(
  path.join(__dirname, "../templates/index.js.mustache"),
  "utf-8",
);

const printIndex = async (ast) => {
  const options = {
    hasInnerBlocks: false,
  };

  visit(ast, "element", (node) => {
    if (node.tagName === "blocks") {
      options.hasInnerBlocks = true;
    }
  });

  const renderedTemplate = Mustache.render(template, options);

  const formattedTemplate = await format(renderedTemplate, { parser: "babel" });
  return formattedTemplate;
};

export default printIndex;
